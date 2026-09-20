"use client";

import { LiveBoard } from "@/components/LiveSocial";

export default function LeaderboardPage() {
  return (
    <div className="mx-auto max-w-lg">
      <div className="mb-6 flex items-end justify-between">
        <div>
          <p className="mono-kicker text-xs uppercase">FEE LEGENDS</p>
          <div className="mt-1 flex items-center gap-3">
            <h1 className="text-2xl font-bold">Top fee earners</h1>
            <span className="inline-flex items-center gap-1.5 font-mono text-[10px] font-bold uppercase tracking-[0.16em] text-mint">
              <span className="live-dot" />
              Live
            </span>
          </div>
        </div>
        <p className="text-sm text-muted">24h / 7d / all</p>
      </div>
      <LiveBoard variant="page" max={24} interval={2600} />
    </div>
  );
}
