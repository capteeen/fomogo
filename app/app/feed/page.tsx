"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { LiveFeed } from "@/components/LiveSocial";
import type { FeedItem, LaunchRecord } from "@/lib/demo";
import { displayHandle } from "@/lib/handles";

export default function FeedPage() {
  const [tab, setTab] = useState<"all" | "launches" | "fees">("all");
  const [live, setLive] = useState<FeedItem[]>([]);

  useEffect(() => {
    fetch("/api/launches")
      .then((r) => r.json())
      .then((data) => {
        const items: FeedItem[] = (data.launches ?? []).map((l: LaunchRecord) => ({
          id: l.mint,
          kind: "launch" as const,
          handle: displayHandle(l.shareholders?.[0]?.handle ?? "anon"),
          body: `launched $${l.ticker || l.name} · fees → ${(l.shareholders ?? [])
            .map((s) => displayHandle(s.handle))
            .join(", ")}`,
          ticker: l.ticker,
          age: "just now",
        }));
        setLive(items);
      })
      .catch(() => undefined);
  }, []);

  return (
    <div className="mx-auto max-w-lg">
      <div className="mb-5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold">Feed</h1>
          <span className="inline-flex items-center gap-1.5 font-mono text-[10px] font-bold uppercase tracking-[0.16em] text-mint">
            <span className="live-dot" />
            Live
          </span>
        </div>
        <Link href="/app/launch" className="btn-primary px-4 py-2 text-sm">
          Quick launch
        </Link>
      </div>
      <div className="mb-4 flex gap-2 text-sm font-bold">
        {[
          ["all", "Following"],
          ["launches", "New launches"],
          ["fees", "Fee hot"],
        ].map(([id, label]) => (
          <button
            key={id}
            type="button"
            onClick={() => setTab(id as typeof tab)}
            className={`rounded-full px-4 py-1.5 ${
              tab === id ? "bg-accent text-white" : "bg-surface text-muted"
            }`}
          >
            {label}
          </button>
        ))}
      </div>
      <LiveFeed variant="page" tab={tab} extras={live} max={16} interval={2300} />
    </div>
  );
}
