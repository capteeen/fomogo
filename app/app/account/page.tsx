"use client";

import { useEffect, useState } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import bs58 from "bs58";
import { normalizeHandle } from "@/lib/handles";

export default function AccountPage() {
  const wallet = useWallet();
  const [handle, setHandle] = useState("");
  const [status, setStatus] = useState("");
  const [linked, setLinked] = useState<{ handle: string; wallet: string } | null>(null);

  useEffect(() => {
    if (!wallet.publicKey) return;
    fetch(`/api/handles?wallet=${wallet.publicKey.toBase58()}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.handle) {
          setLinked({ handle: data.handle, wallet: data.wallet });
          setHandle(data.handle);
        }
      })
      .catch(() => undefined);
  }, [wallet.publicKey]);

  async function link() {
    if (!wallet.publicKey || !wallet.signMessage) {
      setStatus("Connect a wallet that can sign messages.");
      return;
    }
    const h = normalizeHandle(handle);
    const message = `fomogo:link:@${h}:${wallet.publicKey.toBase58()}`;
    const sig = await wallet.signMessage(new TextEncoder().encode(message));
    const res = await fetch("/api/handles", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        handle: h,
        wallet: wallet.publicKey.toBase58(),
        message,
        signature: bs58.encode(sig),
      }),
    });
    const data = await res.json();
    if (!res.ok) {
      setStatus(data.error ?? "link failed");
      return;
    }
    setLinked({ handle: h, wallet: wallet.publicKey.toBase58() });
    setStatus("Handle linked.");
  }

  return (
    <div className="mx-auto max-w-md">
      <h1 className="text-2xl font-bold">Account</h1>
      <p className="mt-1 text-sm text-muted">
        Link a handle to this wallet. Routing resolves @names to this address.
      </p>
      <div className="card-panel mt-5 p-5">
        <p className="text-xs font-bold uppercase tracking-wide text-muted">Linked wallet</p>
        <p className="mt-1 truncate font-mono text-sm">
          {wallet.publicKey?.toBase58() ?? "not connected"}
        </p>
        <p className="mt-4 text-xs font-bold uppercase tracking-wide text-muted">Handle</p>
        <div className="mt-1 flex gap-2">
          <input
            value={handle}
            onChange={(e) => setHandle(e.target.value)}
            placeholder="@you"
            className="min-w-0 flex-1 rounded-xl border border-line bg-void px-4 py-3 outline-none"
          />
          <button type="button" onClick={link} className="btn-primary px-4">
            Link
          </button>
        </div>
        {linked && (
          <p className="mt-3 text-sm text-mint">
            @{linked.handle} → {linked.wallet.slice(0, 4)}…{linked.wallet.slice(-4)}
          </p>
        )}
      </div>
      <p className="mt-6 text-xs leading-5 text-dim">
        FOMOGO is not affiliated with FOMO Labs. Username routing is not custody advice. Pump
        fee-sharing admin is revoked after the split is locked.
      </p>
      {status && <p className="mt-3 text-sm text-lilac-mid">{status}</p>}
    </div>
  );
}
