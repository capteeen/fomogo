"use client";

import { useMemo, useState } from "react";
import {
  BPS_TOTAL,
  MAX_SHAREHOLDERS,
  bpsSum,
  displayHandle,
  normalizeHandle,
  pctFromBps,
} from "@/lib/handles";

export type SplitRow = { handle: string; bps: number };

export function SplitEditor({
  rows,
  onChange,
}: {
  rows: SplitRow[];
  onChange: (rows: SplitRow[]) => void;
}) {
  const total = bpsSum(rows);
  const valid = total === BPS_TOTAL && rows.length > 0 && rows.length <= MAX_SHAREHOLDERS;

  function update(i: number, patch: Partial<SplitRow>) {
    onChange(rows.map((row, idx) => (idx === i ? { ...row, ...patch } : row)));
  }

  return (
    <div className="space-y-3">
      <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-muted">
        send creator fees to
      </p>
      {rows.map((row, i) => (
        <div key={i} className="flex items-center gap-2 rounded-[14px] border border-line bg-panel px-3 py-2.5">
          <span className="text-muted">@</span>
          <input
            value={row.handle.replace(/^@/, "")}
            onChange={(e) => update(i, { handle: normalizeHandle(e.target.value) })}
            placeholder="handle"
            className="min-w-0 flex-1 bg-transparent text-sm font-bold outline-none"
          />
          <input
            type="number"
            min={1}
            max={BPS_TOTAL}
            value={Math.round(row.bps / 100)}
            onChange={(e) => update(i, { bps: Math.max(1, Number(e.target.value)) * 100 })}
            className="w-16 rounded-lg bg-surface-2 px-2 py-1 text-right font-mono text-sm text-accent outline-none"
          />
          <span className="text-xs text-muted">%</span>
          {rows.length > 1 && (
            <button
              type="button"
              className="text-muted hover:text-coral"
              onClick={() => onChange(rows.filter((_, idx) => idx !== i))}
            >
              ×
            </button>
          )}
        </div>
      ))}
      {rows.length < MAX_SHAREHOLDERS && (
        <button
          type="button"
          className="text-sm font-bold text-accent"
          onClick={() =>
            onChange([...rows, { handle: "", bps: Math.max(100, BPS_TOTAL - total) }])
          }
        >
          + Add handle
        </button>
      )}
      <div className="flex items-center justify-between text-sm">
        <span className="text-muted">
          {rows.length} recipient{rows.length === 1 ? "" : "s"} · max {MAX_SHAREHOLDERS}
        </span>
        <span className={valid ? "font-mono text-mint" : "font-mono text-coral"}>
          {pctFromBps(total)} / 100%
        </span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-surface-3">
        <div
          className="h-full bg-gradient-to-r from-accent to-mint"
          style={{ width: `${Math.min(100, total / 100)}%` }}
        />
      </div>
      <div className="flex flex-wrap gap-2">
        {rows
          .filter((r) => r.handle)
          .map((r) => (
            <span
              key={r.handle}
              className="rounded-full border border-line bg-surface px-3 py-1 text-xs font-bold"
            >
              {displayHandle(r.handle)} · {pctFromBps(r.bps)}
            </span>
          ))}
      </div>
    </div>
  );
}

export function useDefaultSplit(handle = "you") {
  const [rows, setRows] = useState<SplitRow[]>([{ handle, bps: BPS_TOTAL }]);
  const valid = useMemo(
    () =>
      bpsSum(rows) === BPS_TOTAL &&
      rows.length > 0 &&
      rows.length <= MAX_SHAREHOLDERS &&
      rows.every((r) => normalizeHandle(r.handle).length > 0),
    [rows],
  );
  return { rows, setRows, valid };
}
