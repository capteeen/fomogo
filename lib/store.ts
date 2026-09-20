import { promises as fs } from "fs";
import path from "path";
import type { HandleRecord, LaunchRecord } from "@/lib/demo";

const dataDir = path.join(process.cwd(), "data");

async function readJson<T>(file: string, fallback: T): Promise<T> {
  const full = path.join(dataDir, file);
  try {
    const raw = await fs.readFile(full, "utf8");
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

async function writeJson(file: string, value: unknown) {
  await fs.mkdir(dataDir, { recursive: true });
  await fs.writeFile(path.join(dataDir, file), JSON.stringify(value, null, 2));
}

export async function listHandles(): Promise<HandleRecord[]> {
  return readJson<HandleRecord[]>("handles.json", []);
}

export async function upsertHandle(record: HandleRecord) {
  const rows = await listHandles();
  const next = rows.filter((row) => row.handle !== record.handle);
  next.push(record);
  await writeJson("handles.json", next);
  return record;
}

export async function findHandle(handle: string) {
  const rows = await listHandles();
  return rows.find((row) => row.handle === handle) ?? null;
}

export async function listLaunches(): Promise<LaunchRecord[]> {
  return readJson<LaunchRecord[]>("launches.json", []);
}

export async function upsertLaunch(record: LaunchRecord) {
  const rows = await listLaunches();
  const next = rows.filter((row) => row.mint !== record.mint);
  next.unshift(record);
  await writeJson("launches.json", next);
  return record;
}

export async function findLaunch(mint: string) {
  const rows = await listLaunches();
  return rows.find((row) => row.mint === mint) ?? null;
}
