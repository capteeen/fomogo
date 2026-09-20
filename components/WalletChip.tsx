"use client";

import { useEffect, useState } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { useWalletModal } from "@solana/wallet-adapter-react-ui";

export function WalletChip() {
  const { connected, publicKey, disconnecting } = useWallet();
  const { setVisible } = useWalletModal();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const label =
    mounted && connected && publicKey
      ? `${publicKey.toBase58().slice(0, 4)}…${publicKey.toBase58().slice(-4)}`
      : mounted && disconnecting
        ? "…"
        : "Login";
  return (
    <button
      type="button"
      onClick={() => setVisible(true)}
      className="h-10 rounded-lg bg-surface px-5 text-[13px] font-bold ring-1 ring-line hover:bg-surface-3"
    >
      {label}
    </button>
  );
}
