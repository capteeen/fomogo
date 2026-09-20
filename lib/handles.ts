export function normalizeHandle(raw: string): string {
  return raw.trim().replace(/^@+/, "").toLowerCase();
}

export function displayHandle(raw: string): string {
  const h = normalizeHandle(raw);
  return h ? `@${h}` : "";
}

export const MAX_SHAREHOLDERS = 10;
export const BPS_TOTAL = 10_000;

export type ShareholderInput = {
  handle: string;
  wallet?: string;
  bps: number;
};

export function bpsSum(rows: { bps: number }[]): number {
  return rows.reduce((acc, row) => acc + Number(row.bps || 0), 0);
}

export function pctFromBps(bps: number): string {
  return `${(bps / 100).toFixed(bps % 100 === 0 ? 0 : 2)}%`;
}
