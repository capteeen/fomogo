"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { DEMO_FEED, profileFor, type FeedItem, type LaunchRecord } from "@/lib/demo";
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

  const rows = [...live, ...DEMO_FEED].filter((row) => {
    if (tab === "launches") return row.kind === "launch";
    if (tab === "fees") return row.kind === "claim" || row.kind === "route";
    return true;
  });

  return (
    <div className="mx-auto max-w-lg">
      <div className="mb-5 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Feed</h1>
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
      <div className="divide-y divide-line rounded-[22px] border border-line bg-surface">
        {rows.map((row) => {
          const profile = profileFor(row.handle);
          const initials = row.handle.replace("@", "").slice(0, 2).toUpperCase();
          return (
            <article key={row.id} className="flex gap-3 px-4 py-3.5">
              {profile?.avatar ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={profile.avatar}
                  alt=""
                  className="h-10 w-10 shrink-0 rounded-full object-cover"
                />
              ) : (
                <div
                  className="grid h-10 w-10 shrink-0 place-items-center rounded-full text-sm font-bold"
                  style={{ background: "#221d4b" }}
                >
                  {initials}
                </div>
              )}
              <div className="min-w-0 flex-1">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="truncate font-bold leading-tight">
                      {profile?.name ?? row.handle}
                    </p>
                    {profile ? (
                      <p className="truncate text-[13px] text-muted">{row.handle}</p>
                    ) : null}
                  </div>
                  <p className="shrink-0 font-mono text-xs text-dim">{row.age}</p>
                </div>
                <p className="mt-0.5 text-sm text-lilac-mid">{row.body}</p>
                {row.delta && (
                  <p className={`mt-1 text-sm font-bold ${row.positive ? "text-mint" : "text-coral"}`}>
                    {row.delta}
                  </p>
                )}
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}
