import { clusterApiUrl, type Cluster } from "@solana/web3.js";

export function clusterName(): Cluster {
  const value = process.env.NEXT_PUBLIC_SOLANA_CLUSTER ?? "devnet";
  if (value === "mainnet-beta" || value === "testnet" || value === "devnet") {
    return value;
  }
  return "devnet";
}

export function clusterRpc(): string {
  const rpc = process.env.NEXT_PUBLIC_SOLANA_RPC?.trim();
  if (rpc && (rpc.startsWith("http:") || rpc.startsWith("https:"))) {
    return rpc;
  }
  return clusterApiUrl(clusterName());
}
