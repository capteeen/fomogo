"use client";

import { useState } from "react";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { PublicKey } from "@solana/web3.js";
import { SplitEditor, useDefaultSplit } from "@/components/SplitEditor";
import { createSharingAndLock, sendInstructions } from "@/lib/pump";
import { BPS_TOTAL, normalizeHandle } from "@/lib/handles";

export default function MigratePage() {
  const { connection } = useConnection();
  const wallet = useWallet();
  const { rows, setRows, valid } = useDefaultSplit();
  const [mint, setMint] = useState("");
  const [looked, setLooked] = useState<string>("");
  const [status, setStatus] = useState("");
  const [busy, setBusy] = useState(false);

  async function lookup() {
    try {
      const pk = new PublicKey(mint.trim());
      const info = await connection.getAccountInfo(pk);
      setLooked(info ? `mint found · ${pk.toBase58().slice(0, 6)}…` : "account missing on this cluster");
    } catch {
      setLooked("invalid mint");
    }
  }

  async function migrate() {
    if (!wallet.publicKey || !wallet.signTransaction) {
      setStatus("Connect the creator wallet.");
      return;
    }
    if (!valid) {
      setStatus("Need 1–10 handles totaling 10,000 bps.");
      return;
    }
    setBusy(true);
    try {
      const mintPk = new PublicKey(mint.trim());
      const shareholders = [];
      for (const row of rows) {
        const handle = normalizeHandle(row.handle);
        const res = await fetch(`/api/handles?handle=${encodeURIComponent(handle)}`);
        const data = await res.json();
        shareholders.push({
          handle,
          address: new PublicKey(data.wallet ?? wallet.publicKey.toBase58()),
          shareBps: row.bps,
        });
      }
      if (shareholders.reduce((a, s) => a + s.shareBps, 0) !== BPS_TOTAL) {
        throw new Error("share_bps must sum to 10_000");
      }
      const { createIx, updateIx } = await createSharingAndLock({
        connection,
        creator: wallet.publicKey,
        mint: mintPk,
        shareholders: shareholders.map((s) => ({ address: s.address, shareBps: s.shareBps })),
      });
      const sig = await sendInstructions(connection, wallet.publicKey, wallet.signTransaction, [
        createIx,
        updateIx,
      ]);
      await fetch("/api/launches", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          mint: mintPk.toBase58(),
          creator: wallet.publicKey.toBase58(),
          shareholders: shareholders.map((s) => ({
            handle: s.handle,
            wallet: s.address.toBase58(),
            bps: s.shareBps,
          })),
          signature: sig,
        }),
      });
      setStatus(`Migrated. ${sig.slice(0, 12)}… Holders are unaffected.`);
    } catch (err) {
      setStatus(err instanceof Error ? err.message : String(err));
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="mx-auto max-w-md">
      <p className="mono-kicker text-xs uppercase">ALREADY LAUNCHED?</p>
      <h1 className="mt-1 text-2xl font-bold">Migrate fees</h1>
      <div className="mt-5 flex gap-2">
        <input
          value={mint}
          onChange={(e) => setMint(e.target.value)}
          placeholder="Mint address"
          className="min-w-0 flex-1 rounded-xl border border-line bg-surface px-4 py-3 font-mono text-sm outline-none"
        />
        <button type="button" onClick={lookup} className="btn-primary px-5">
          Look up
        </button>
      </div>
      {looked && <p className="mt-2 text-sm text-mint">{looked}</p>}
      <div className="card-panel mt-6 p-4">
        <SplitEditor rows={rows} onChange={setRows} />
      </div>
      <p className="mt-4 text-sm text-muted">
        Sign as the coin creator. Holders are unaffected. The split locks on-chain and cannot be changed afterwards.
      </p>
      <button
        type="button"
        disabled={busy}
        onClick={migrate}
        className="btn-primary mt-5 h-12 w-full text-lg disabled:opacity-50"
      >
        {busy ? "Migrating…" : "Migrate fees"}
      </button>
      {status && <p className="mt-3 text-sm text-lilac-mid">{status}</p>}
    </div>
  );
}
