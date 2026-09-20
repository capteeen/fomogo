"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { SplitEditor, useDefaultSplit } from "@/components/SplitEditor";
import { createPumpTokenInstructions, newMintKeypair, sendInstructions } from "@/lib/pump";
import { normalizeHandle } from "@/lib/handles";

export default function LaunchPage() {
  const router = useRouter();
  const { connection } = useConnection();
  const wallet = useWallet();
  const { rows, setRows, valid } = useDefaultSplit();
  const [name, setName] = useState("");
  const [ticker, setTicker] = useState("");
  const [desc, setDesc] = useState("");
  const [buy, setBuy] = useState("0");
  const [image, setImage] = useState<string>("");
  const [status, setStatus] = useState<string>("");
  const [busy, setBusy] = useState(false);

  async function onImage(file: File | undefined) {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setImage(String(reader.result ?? ""));
    reader.readAsDataURL(file);
  }

  async function onLaunch() {
    if (!wallet.publicKey || !wallet.signTransaction) {
      setStatus("Connect a wallet first.");
      return;
    }
    if (!name || !ticker || !valid) {
      setStatus("Name, ticker, and a 100% handle split are required.");
      return;
    }
    setBusy(true);
    setStatus("Resolving handles…");
    try {
      const resolved: { handle: string; wallet: string; bps: number }[] = [];
      for (const row of rows) {
        const handle = normalizeHandle(row.handle);
        const res = await fetch(`/api/handles?handle=${encodeURIComponent(handle)}`);
        const data = await res.json();
        const addr = data.wallet ?? wallet.publicKey.toBase58();
        resolved.push({ handle, wallet: addr, bps: row.bps });
      }

      const mint = newMintKeypair();
      const metaRes = await fetch("/api/metadata", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          mint: mint.publicKey.toBase58(),
          name,
          symbol: ticker.toUpperCase(),
          description: desc,
          image,
        }),
      });
      const meta = await metaRes.json();
      const origin = window.location.origin;
      const uri = meta.uri.startsWith("http") ? meta.uri : `${origin}${meta.uri}`;

      setStatus("Building pump createV2…");
      const buyLamports = Math.round(Number(buy || 0) * 1e9);
      const ixs = await createPumpTokenInstructions({
        connection,
        user: wallet.publicKey,
        mint: mint.publicKey,
        name,
        symbol: ticker.toUpperCase(),
        uri,
        buyLamports,
      });

      setStatus("Sign to create on pump.fun (devnet)…");
      const sig = await sendInstructions(
        connection,
        wallet.publicKey,
        async (tx) => {
          tx.partialSign(mint);
          return wallet.signTransaction!(tx);
        },
        ixs,
      );

      await fetch("/api/launches", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          mint: mint.publicKey.toBase58(),
          name,
          ticker: ticker.toUpperCase(),
          description: desc,
          image,
          creator: wallet.publicKey.toBase58(),
          shareholders: resolved,
          signature: sig,
        }),
      });

      router.push(
        `/app/route?mint=${mint.publicKey.toBase58()}&from=launch`,
      );
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      setStatus(message);
    } finally {
      setBusy(false);
    }
  }

  const initial = image ? "" : (name[0] ?? "G").toUpperCase();

  return (
    <div className="mx-auto max-w-md">
      <div className="mb-5 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Launch a token</h1>
        <span className="rounded-full border border-line px-3 py-1 font-mono text-[11px] text-accent">
          PUMP.FUN
        </span>
      </div>

      <label className="mb-5 flex items-center gap-4">
        <div
          className="grid h-20 w-20 place-items-center overflow-hidden rounded-2xl text-3xl font-bold"
          style={{ background: "linear-gradient(180deg,#6a80ff,#516af6)" }}
        >
          {image ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={image} alt="" className="h-full w-full object-cover" />
          ) : (
            initial
          )}
        </div>
        <div>
          <p className="text-sm font-bold">Token image</p>
          <p className="text-xs text-muted">PNG / JPG · drop or click</p>
          <input
            type="file"
            accept="image/*"
            className="mt-2 text-xs file:mr-3 file:rounded-lg file:border-0 file:bg-surface-3 file:px-3 file:py-1.5 file:text-xs file:font-bold file:text-ink"
            onChange={(e) => onImage(e.target.files?.[0])}
          />
        </div>
      </label>

      <label className="block text-xs font-bold uppercase tracking-wide text-muted">Name</label>
      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="mt-1 mb-4 w-full rounded-xl border border-line bg-surface px-4 py-3 outline-none"
        placeholder="Hands"
      />
      <label className="block text-xs font-bold uppercase tracking-wide text-muted">Ticker</label>
      <input
        value={ticker}
        onChange={(e) => setTicker(e.target.value.toUpperCase())}
        className="mt-1 mb-4 w-full rounded-xl border border-line bg-surface px-4 py-3 outline-none"
        placeholder="HANDS"
        maxLength={12}
      />
      <label className="block text-xs font-bold uppercase tracking-wide text-muted">
        Description
      </label>
      <textarea
        value={desc}
        onChange={(e) => setDesc(e.target.value)}
        className="mt-1 mb-5 w-full rounded-xl border border-line bg-surface px-4 py-3 outline-none"
        rows={3}
        placeholder="the token for people who hold with both hands"
      />

      <div className="card-panel mb-5 p-4">
        <div className="mb-3 flex items-center justify-between">
          <div>
            <p className="font-bold">Route creator fees to handles</p>
            <p className="text-xs text-muted">Fees land on names, not raw addresses</p>
          </div>
        </div>
        <SplitEditor rows={rows} onChange={setRows} />
      </div>

      <div className="mb-6 flex items-center justify-between">
        <span className="font-bold">Dev buy</span>
        <div className="flex items-center gap-2">
          <input
            value={buy}
            onChange={(e) => setBuy(e.target.value)}
            className="w-24 rounded-xl border border-line bg-surface px-3 py-2 text-right font-mono"
          />
          <span className="text-muted">SOL</span>
        </div>
      </div>
      <p className="mb-4 text-sm text-muted">
        Network: <span className="font-mono">devnet</span> · Creator fee 0.30% of every trade
      </p>
      <button
        type="button"
        disabled={busy}
        onClick={onLaunch}
        className="btn-primary h-12 w-full text-lg disabled:opacity-50"
      >
        {busy ? "Working…" : "Create on pump.fun →"}
      </button>
      {status && <p className="mt-3 text-sm text-lilac-mid">{status}</p>}
    </div>
  );
}
