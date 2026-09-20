import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";

export async function POST(req: Request) {
  const body = await req.json();
  const mint = String(body.mint ?? "");
  if (!mint) return NextResponse.json({ error: "mint required" }, { status: 400 });
  const dir = path.join(process.cwd(), "public", "metadata");
  await fs.mkdir(dir, { recursive: true });
  const json = {
    name: body.name,
    symbol: body.symbol,
    description: body.description ?? "",
    image: body.image ?? "",
    showName: true,
    createdOn: "https://fomogo.local",
  };
  await fs.writeFile(path.join(dir, `${mint}.json`), JSON.stringify(json, null, 2));
  return NextResponse.json({ uri: `/metadata/${mint}.json` });
}
