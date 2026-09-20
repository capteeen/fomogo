"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { PublicKey } from "@solana/web3.js";
import { SplitEditor, useDefaultSplit } from "@/components/SplitEditor";
import { createSharingAndLock, sendInstructions } from "@/lib/pump";
import { BPS_TOTAL, normalizeHandle } from "@/lib/handles";
import { Suspense } from "react";

function RouteInner() {
  const params = useSearchParams();
  const mint = params.get("mint") ?? "";
  const { connection } = useConnection();
  const wallet = useWallet();
  const { rows, setRows, valid } = useDefaultSplit();
  const [status, setStatus] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!mint) return;
    fetch(`/api/launches?mint=${mint}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.launch?.shareholders?.length) {
          setRows(
            data.launch.shareholders.map((s: { handle: string; bps: number }) => ({
              handle: s.handle,
              bps: s.bps,
            })),
          );
        }
      })
      .catch(() => undefined);
  }, [mint, setRows]);

  async function lock() {
    if (!wallet.publicKey || !wallet.signTransaction) {
      setStatus("Connect the creator wallet.");
      return;
    }
    if (!mint) {
      setStatus("Missing mint. Launch a token first or paste one on Migrate.");
      return;
    }
    if (!valid) {
      setStatus("Need 1–10 handles totaling 10,000 bps.");
      return;
    }
    setBusy(true);
    try {
      const shareholders: { address: PublicKey; shareBps: number; handle: string }[] = [];
      for (const row of rows) {
        const handle = normalizeHandle(row.handle);
        const res = await fetch(`/api/handles?handle=${encodeURIComponent(handle)}`);
        const data = await res.json();
        const addr = data.wallet ?? wallet.publicKey.toBase58();
        shareholders.push({
          handle,
          address: new PublicKey(addr),
          shareBps: row.bps,
        });
      }
      const bps = shareholders.reduce((a, s) => a + s.shareBps, 0);
      if (bps !== BPS_TOTAL) throw new Error("share_bps must sum to 10_000");

      setStatus("create_fee_sharing_config + update_fee_shares_v2…");
      const { createIx, updateIx } = await createSharingAndLock({
        connection,
        creator: wallet.publicKey,
        mint: new PublicKey(mint),
        shareholders: shareholders.map((s) => ({ address: s.address, shareBps: s.shareBps })),
      });
      const sig = await sendInstructions(
        connection,
        wallet.publicKey,
        wallet.signTransaction,
        [createIx, updateIx],
      );
      await fetch("/api/launches", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          mint,
          creator: wallet.publicKey.toBase58(),
          shareholders: shareholders.map((s) => ({
            handle: s.handle,
            wallet: s.address.toBase58(),
            bps: s.shareBps,
          })),
          signature: sig,
        }),
      });
      setStatus(`Locked on-chain. ${sig.slice(0, 8)}… — admin is revoked after this.`);
    } catch (err) {
      setStatus(err instanceof Error ? err.message : String(err));
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="mx-auto max-w-md">
      <h1 className="text-2xl font-bold">Fee router</h1>
      <p className="mt-1 text-sm text-muted">
        Mint is read-only after launch. Max 10 handles, bps = 10,000. This lock is one-shot.
      </p>
      <label className="mt-5 block text-xs font-bold uppercase tracking-wide text-muted">Mint</label>
      <input
        readOnly
        value={mint}
        placeholder="launch a token first"
        className="mt-1 mb-5 w-full truncate rounded-xl border border-line bg-surface px-4 py-3 font-mono text-xs"
      />
      <div className="card-panel p-4">
        <SplitEditor rows={rows} onChange={setRows} />
      </div>
      <p className="mt-4 text-sm text-coral">
        Heads up: pump.fun locks the split once confirmed — it cannot be changed afterwards.
      </p>
      <button
        type="button"
        disabled={busy}
        onClick={lock}
        className="btn-primary mt-5 h-12 w-full text-lg disabled:opacity-50"
      >
        {busy ? "Locking…" : "Lock shares on-chain"}
      </button>
      {status && <p className="mt-3 text-sm text-lilac-mid">{status}</p>}
    </div>
  );
}

export default function RoutePage() {
  return (
    <Suspense>
      <RouteInner />
    </Suspense>
  );
}
