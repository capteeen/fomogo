import { NextResponse } from "next/server";
import nacl from "tweetnacl";
import bs58 from "bs58";
import { PublicKey } from "@solana/web3.js";
import { findHandle, listHandles, upsertHandle } from "@/lib/store";
import { normalizeHandle } from "@/lib/handles";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const handle = searchParams.get("handle");
  const wallet = searchParams.get("wallet");
  if (handle) {
    const row = await findHandle(normalizeHandle(handle));
    return NextResponse.json(row ?? {});
  }
  if (wallet) {
    const rows = await listHandles();
    const row = rows.find((r) => r.wallet === wallet);
    return NextResponse.json(row ?? {});
  }
  return NextResponse.json({ handles: await listHandles() });
}

export async function POST(req: Request) {
  const body = await req.json();
  const handle = normalizeHandle(String(body.handle ?? ""));
  const wallet = String(body.wallet ?? "");
  const message = String(body.message ?? "");
  const signature = String(body.signature ?? "");
  if (!handle || !wallet || !message || !signature) {
    return NextResponse.json({ error: "handle, wallet, message, signature required" }, { status: 400 });
  }
  try {
    const pubkey = new PublicKey(wallet);
    const ok = nacl.sign.detached.verify(
      new TextEncoder().encode(message),
      bs58.decode(signature),
      pubkey.toBytes(),
    );
    if (!ok) return NextResponse.json({ error: "bad signature" }, { status: 400 });
    if (!message.includes(`@${handle}`) || !message.includes(wallet)) {
      return NextResponse.json({ error: "message mismatch" }, { status: 400 });
    }
    const record = await upsertHandle({
      handle,
      wallet,
      verifiedAt: new Date().toISOString(),
    });
    return NextResponse.json(record);
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "verify failed" },
      { status: 400 },
    );
  }
}
