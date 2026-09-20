"use client";

import { useState } from "react";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { PublicKey } from "@solana/web3.js";
import { distributeFees, sendInstructions } from "@/lib/pump";
import { displayHandle, normalizeHandle } from "@/lib/handles";

export default function ClaimPage() {
  const { connection } = useConnection();
  const wallet = useWallet();
  const [handle, setHandle] = useState("");
  const [mint, setMint] = useState("");
  const [status, setStatus] = useState("");
  const [preview, setPreview] = useState<{ wallet?: string; launches: number } | null>(null);
  const [busy, setBusy] = useState(false);

  async function lookup() {
    const h = normalizeHandle(handle);
    const res = await fetch(`/api/handles?handle=${encodeURIComponent(h)}`);
    const data = await res.json();
    const launches = await fetch("/api/launches").then((r) => r.json());
    const count = (launches.launches ?? []).filter((l: { shareholders?: { handle: string }[] }) =>
      l.shareholders?.some((s) => s.handle === h),
    ).length;
    setPreview({ wallet: data.wallet, launches: count });
  }

  async function claim() {
    if (!wallet.publicKey || !wallet.signTransaction) {
      setStatus("Connect the wallet that owns this handle.");
      return;
    }
    if (!mint) {
      setStatus("Paste a mint to run distribute_creator_fees_v2.");
      return;
    }
    setBusy(true);
    try {
      const h = normalizeHandle(handle);
      const rec = await fetch(`/api/handles?handle=${encodeURIComponent(h)}`).then((r) => r.json());
      if (rec.wallet && rec.wallet !== wallet.publicKey.toBase58()) {
        throw new Error("Connected wallet does not match this handle.");
      }
      const { ix } = await distributeFees({
        connection,
        payer: wallet.publicKey,
        mint: new PublicKey(mint.trim()),
      });
      const sig = await sendInstructions(connection, wallet.publicKey, wallet.signTransaction, [ix]);
      setStatus(`Distributed. ${sig.slice(0, 12)}… Permissionless payout to every shareholder.`);
    } catch (err) {
      setStatus(err instanceof Error ? err.message : String(err));
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="mx-auto max-w-md">
      <h1 className="text-2xl font-bold">Claim fees</h1>
      <p className="mt-1 text-sm text-muted">
        Claiming pays every recipient their share at once — one permissionless pump.fun distribution.
      </p>
      <label className="mt-5 block text-xs font-bold uppercase tracking-wide text-muted">
        Username / @handle
      </label>
      <div className="mt-1 flex gap-2">
        <input
          value={handle}
          onChange={(e) => setHandle(e.target.value)}
          placeholder="@you"
          className="min-w-0 flex-1 rounded-xl border border-line bg-surface px-4 py-3 outline-none"
        />
        <button type="button" onClick={lookup} className="btn-ghost px-4">
          Preview
        </button>
      </div>
      {preview && (
        <div className="mt-4 grid grid-cols-2 gap-2">
          <div className="rounded-xl border border-line bg-panel p-3">
            <div className="text-[11px] uppercase text-muted">handle</div>
            <div className="font-bold">{displayHandle(handle) || "—"}</div>
          </div>
          <div className="rounded-xl border border-line bg-panel p-3">
            <div className="text-[11px] uppercase text-muted">routed tokens</div>
            <div className="font-bold">{preview.launches}</div>
          </div>
        </div>
      )}
      <label className="mt-5 block text-xs font-bold uppercase tracking-wide text-muted">
        Mint to distribute
      </label>
      <input
        value={mint}
        onChange={(e) => setMint(e.target.value)}
        placeholder="mint address"
        className="mt-1 w-full rounded-xl border border-line bg-surface px-4 py-3 font-mono text-sm outline-none"
      />
      <button
        type="button"
        disabled={busy}
        onClick={claim}
        className="btn-primary mt-6 h-12 w-full text-lg disabled:opacity-50"
      >
        {busy ? "Claiming…" : "Claim — gasless"}
      </button>
      {status && <p className="mt-3 text-sm text-lilac-mid">{status}</p>}
    </div>
  );
}
