"use client";

import { DEMO_LEADERBOARD } from "@/lib/demo";

export default function LeaderboardPage() {
  return (
    <div className="mx-auto max-w-lg">
      <div className="mb-6 flex items-end justify-between">
        <div>
          <p className="mono-kicker text-xs uppercase">FEE LEGENDS</p>
          <h1 className="text-2xl font-bold">Top fee earners</h1>
        </div>
        <p className="text-sm text-muted">24h / 7d / all</p>
      </div>
      <div className="divide-y divide-line rounded-[22px] border border-line bg-surface">
        {DEMO_LEADERBOARD.map((row) => (
          <div key={row.handle} className="flex items-center gap-3 px-4 py-3.5">
            <span
              className={`grid h-8 w-8 place-items-center rounded-full font-mono text-sm font-bold ${
                row.rank === 1
                  ? "bg-[#ffbf17] text-void"
                  : row.rank === 2
                    ? "bg-[#c9cdd8] text-void"
                    : row.rank === 3
                      ? "bg-[#c47a3a] text-void"
                      : "text-muted"
              }`}
            >
              {row.rank}
            </span>
            {row.avatar ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={row.avatar}
                alt=""
                className="h-10 w-10 shrink-0 rounded-full object-cover"
              />
            ) : (
              <div
                className="grid h-10 w-10 place-items-center rounded-full text-sm font-bold"
                style={{ background: "#516af6" }}
              >
                {row.name.slice(0, 2).toUpperCase()}
              </div>
            )}
            <div className="min-w-0 flex-1">
              <p className="font-bold leading-tight">{row.name}</p>
              <p className="text-sm text-muted">{row.handle}</p>
            </div>
            <div className="text-right">
              <p className="font-bold text-mint">+{row.fees} SOL</p>
              <p className="text-xs text-dim">
                {row.tokens} token{row.tokens === 1 ? "" : "s"}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
