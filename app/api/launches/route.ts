import { NextResponse } from "next/server";
import { findLaunch, listLaunches, upsertLaunch } from "@/lib/store";
import type { LaunchRecord } from "@/lib/demo";

export async function GET(req: Request) {
  const mint = new URL(req.url).searchParams.get("mint");
  if (mint) {
    return NextResponse.json({ launch: await findLaunch(mint) });
  }
  return NextResponse.json({ launches: await listLaunches() });
}

export async function POST(req: Request) {
  const body = (await req.json()) as Partial<LaunchRecord>;
  if (!body.mint) {
    return NextResponse.json({ error: "mint required" }, { status: 400 });
  }
  const existing = await findLaunch(body.mint);
  const record: LaunchRecord = {
    mint: body.mint,
    name: body.name ?? existing?.name ?? "",
    ticker: body.ticker ?? existing?.ticker ?? "",
    description: body.description ?? existing?.description,
    image: body.image ?? existing?.image,
    creator: body.creator ?? existing?.creator ?? "",
    shareholders: body.shareholders ?? existing?.shareholders ?? [],
    signature: body.signature ?? existing?.signature,
    createdAt: existing?.createdAt ?? new Date().toISOString(),
  };
  await upsertLaunch(record);
  return NextResponse.json(record);
}
