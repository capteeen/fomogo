"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import {
  DEMO_FEED,
  DEMO_LEADERBOARD,
  makeAlert,
  makeFeedEvent,
  profileFor,
  type AlertItem,
  type FeedItem,
  type LeaderboardRow,
} from "@/lib/demo";

function Face({ src, alt, className = "h-10 w-10" }: { src: string; alt: string; className?: string }) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={src} alt={alt} className={`face-pop shrink-0 rounded-full object-cover ${className}`} />
  );
}

function LiveDot() {
  return (
    <span className="inline-flex items-center gap-1.5 font-mono text-[10px] font-bold uppercase tracking-[0.16em] text-mint">
      <span className="live-dot" />
      Live
    </span>
  );
}

function Medal({ rank }: { rank: number }) {
  if (rank > 3) {
    return <span className="w-5 text-center text-[13px] font-medium text-dim">{rank}.</span>;
  }
  const tone =
    rank === 1 ? "from-[#ffd24a] to-[#e09a12]" : rank === 2 ? "from-[#e8eef8] to-[#9aa3b5]" : "from-[#e08a3c] to-[#a85a22]";
  return (
    <span
      className={`grid h-5 w-5 shrink-0 place-items-center rounded-full bg-gradient-to-b text-[9px] shadow-[0_1px_2px_#0008] ${tone}`}
      aria-hidden
    >
      🏆
    </span>
  );
}

function KindPill({ kind }: { kind: FeedItem["kind"] }) {
  if (kind === "launch") {
    return <span className="rounded-md bg-accent px-1.5 py-0.5 text-[10px] font-bold">Launch</span>;
  }
  if (kind === "claim") {
    return <span className="rounded-md bg-mint/15 px-1.5 py-0.5 text-[10px] font-bold text-mint">Claim</span>;
  }
  return <span className="rounded-md bg-coral/80 px-1.5 py-0.5 text-[10px] font-bold">Route</span>;
}

function FeedRow({
  row,
  fresh,
  dim,
  compact,
}: {
  row: FeedItem;
  fresh?: boolean;
  dim?: boolean;
  compact?: boolean;
}) {
  const profile = profileFor(row.handle);
  const initials = row.handle.replace("@", "").slice(0, 2).toUpperCase();

  return (
    <article
      className={`live-row ${fresh ? "pop-enter" : ""} ${dim ? "opacity-50" : ""} ${
        compact ? "rounded-xl px-2 py-2" : "flex gap-3 px-4 py-3.5"
      } ${compact && row.kind === "claim" ? "bg-[#12121c]" : ""}`}
    >
      {compact ? (
        <>
          <div className="flex items-center gap-2">
            {profile?.avatar ? (
              <Face src={profile.avatar} alt="" className="h-10 w-10" />
            ) : (
              <div className="grid h-10 w-10 place-items-center rounded-full bg-accent-soft text-sm font-bold">
                {initials}
              </div>
            )}
            <p className="truncate text-[13px] font-bold">{profile?.name ?? row.handle}</p>
            <KindPill kind={row.kind} />
            <span className="ml-auto font-mono text-[11px] text-dim">{row.age}</span>
          </div>
          {row.kind === "claim" && row.delta ? (
            <div className="mt-2 flex items-center gap-2.5 rounded-xl bg-[#0a0a12] px-2.5 py-2">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/features/token-hands.svg" alt="" className="h-8 w-8 rounded-full" />
              <div className="min-w-0 flex-1">
                <p className="text-[12px] font-bold">
                  Position <span className="text-mint">Claim</span>
                </p>
                <p className="text-[11px] text-muted">
                  ${row.ticker} · {row.delta.replace("+", "")}
                </p>
              </div>
              <div className="text-right">
                <p className="text-[13px] font-bold">{row.delta.replace(" SOL", "")}</p>
                <p className="text-[11px] font-bold text-mint">hot</p>
              </div>
            </div>
          ) : (
            <p className="mt-1.5 pl-12 text-[13px] text-lilac-mid">{row.body}</p>
          )}
        </>
      ) : (
        <>
          {profile?.avatar ? (
            <Face src={profile.avatar} alt="" />
          ) : (
            <div className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-accent-soft text-sm font-bold">
              {initials}
            </div>
          )}
          <div className="min-w-0 flex-1">
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <p className="truncate font-bold leading-tight">{profile?.name ?? row.handle}</p>
                {profile ? <p className="truncate text-[13px] text-muted">{row.handle}</p> : null}
              </div>
              <p className="shrink-0 font-mono text-xs text-dim">{row.age}</p>
            </div>
            <p className="mt-0.5 text-sm text-lilac-mid">{row.body}</p>
            {row.delta ? (
              <p className={`mt-1 text-sm font-bold ${row.positive ? "text-mint" : "text-coral"}`}>{row.delta}</p>
            ) : null}
          </div>
        </>
      )}
    </article>
  );
}

function nextKind(tab: "all" | "launches" | "fees", seed: number): FeedItem["kind"] | undefined {
  if (tab === "launches") return "launch";
  if (tab === "fees") return seed % 2 === 0 ? "claim" : "route";
  return undefined;
}

export function LiveFeed({
  variant = "card",
  tab = "all",
  extras = [],
  max = 5,
  interval = 2600,
}: {
  variant?: "card" | "page";
  tab?: "all" | "launches" | "fees";
  extras?: FeedItem[];
  max?: number;
  interval?: number;
}) {
  const compact = variant === "card";
  const [items, setItems] = useState<FeedItem[]>(() => DEMO_FEED.slice(0, max));
  const [fresh, setFresh] = useState<string | null>(null);
  const seed = useRef(max + 20);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const id = window.setInterval(
      () => {
        const next = makeFeedEvent(seed.current++, nextKind(tab, seed.current));
        next.age = "now";
        setItems((prev) => [next, ...prev].slice(0, max));
        setFresh(next.id);
      },
      reduced ? 9000 : interval,
    );
    return () => window.clearInterval(id);
  }, [interval, max, tab]);

  const rows = [...extras, ...items].filter((row) => {
    if (tab === "launches") return row.kind === "launch";
    if (tab === "fees") return row.kind === "claim" || row.kind === "route";
    return true;
  });

  if (compact) {
    return (
      <div className="space-y-2.5 rounded-2xl border border-white/5 bg-[#08080f] p-2.5">
        {rows.slice(0, max).map((row, index) => (
          <FeedRow
            key={row.id}
            row={row}
            compact
            fresh={row.id === fresh}
            dim={index === Math.min(rows.length, max) - 1}
          />
        ))}
      </div>
    );
  }

  return (
    <div className="divide-y divide-line overflow-hidden rounded-[22px] border border-line bg-surface">
      {rows.slice(0, max).map((row) => (
        <FeedRow key={row.id} row={row} fresh={row.id === fresh} />
      ))}
    </div>
  );
}

function BoardRow({
  row,
  variant,
  bumped,
  entered,
  index,
}: {
  row: LeaderboardRow;
  variant: "card" | "page";
  bumped?: boolean;
  entered?: boolean;
  index: number;
}) {
  return (
    <li
      className={`live-row stagger-in flex items-center ${variant === "card" ? "gap-2.5" : "gap-3 px-4 py-3.5"} ${
        bumped ? "row-bump" : ""
      } ${entered ? "pop-enter" : ""}`}
      style={{ "--i": String(index) } as CSSProperties}
    >
      {variant === "card" ? (
        <Medal rank={row.rank} />
      ) : (
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
      )}
      <Face src={row.avatar ?? "/avatars/pointfarmcap.jpg"} alt="" className={variant === "card" ? "h-9 w-9" : "h-10 w-10"} />
      <div className="min-w-0 flex-1">
        <p className={`truncate font-bold leading-tight ${variant === "card" ? "text-[15px]" : ""}`}>{row.name}</p>
        <p className={`truncate text-muted ${variant === "card" ? "text-[13px]" : "text-sm"}`}>{row.handle}</p>
      </div>
      {variant === "card" ? (
        <p key={row.fees} className="fee-tick font-mono text-[13px] font-bold tabular-nums text-mint md:text-[14px]">
          +{row.fees} SOL
        </p>
      ) : (
        <div className="text-right">
          <p key={row.fees} className="fee-tick font-bold text-mint">
            +{row.fees} SOL
          </p>
          <p className="text-xs text-dim">
            {row.tokens} token{row.tokens === 1 ? "" : "s"}
          </p>
        </div>
      )}
    </li>
  );
}

export function LiveBoard({
  variant = "card",
  max = 8,
  interval = 3000,
}: {
  variant?: "card" | "page";
  max?: number;
  interval?: number;
}) {
  const [rows, setRows] = useState<LeaderboardRow[]>(() => DEMO_LEADERBOARD.map((row) => ({ ...row })));
  const [bumped, setBumped] = useState<string | null>(null);
  const [entered, setEntered] = useState<string | null>(null);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const id = window.setInterval(
      () => {
        setRows((prev) => {
          const pick =
            Math.random() < 0.34
              ? Math.floor(Math.random() * Math.min(max, prev.length))
              : Math.min(prev.length - 1, max + Math.floor(Math.random() * 18));
          const target = prev[pick];
          const bump = 0.04 + Math.random() * 0.19;
          const before = new Set(prev.slice(0, max).map((row) => row.handle));
          const next = prev
            .map((row) =>
              row.handle === target.handle ? { ...row, fees: (parseFloat(row.fees) + bump).toFixed(2) } : row,
            )
            .sort((a, b) => parseFloat(b.fees) - parseFloat(a.fees))
            .map((row, index) => ({ ...row, rank: index + 1 }));
          const newbie = next.slice(0, max).find((row) => !before.has(row.handle));
          queueMicrotask(() => {
            setBumped(target.handle);
            setEntered(newbie?.handle ?? null);
          });
          return next;
        });
      },
      reduced ? 10000 : interval,
    );
    return () => window.clearInterval(id);
  }, [interval, max]);

  const visible = rows.slice(0, max);

  return (
    <ul
      className={
        variant === "page"
          ? "divide-y divide-line overflow-hidden rounded-[22px] border border-line bg-surface"
          : "flex-1 space-y-2.5"
      }
    >
      {visible.map((row, index) => (
        <BoardRow
          key={row.handle}
          row={row}
          variant={variant}
          index={index}
          bumped={bumped === row.handle}
          entered={entered === row.handle}
        />
      ))}
    </ul>
  );
}

export function LiveAlerts({ interval = 3400 }: { interval?: number }) {
  const [stack, setStack] = useState<AlertItem[]>(() => [0, 1, 2, 3].map((seed) => makeAlert(seed + 2)));
  const [fresh, setFresh] = useState<string | null>(null);
  const seed = useRef(8);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const id = window.setInterval(
      () => {
        const next = makeAlert(seed.current++);
        next.time = "now";
        setStack((prev) => [next, ...prev].slice(0, 4));
        setFresh(next.id);
      },
      reduced ? 10000 : interval,
    );
    return () => window.clearInterval(id);
  }, [interval]);

  return (
    <div className="mt-5 flex flex-1 flex-col justify-end gap-2 pb-1">
      {stack.map((alert) => (
        <div
          key={alert.id}
          className={`live-row flex w-full items-start gap-3 rounded-2xl border border-white/10 bg-[#1a1a24]/90 px-3.5 py-2.5 shadow-[0_10px_28px_#0008] backdrop-blur-md ${
            fresh === alert.id ? "alert-pop" : ""
          }`}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={alert.icon} alt="" className="h-9 w-9 shrink-0 rounded-[10px]" />
          <div className="min-w-0 flex-1">
            <div className="flex items-start justify-between gap-2">
              <p className="text-[13px] font-bold leading-snug">{alert.title}</p>
              <span className="shrink-0 font-mono text-[10px] text-dim">{alert.time}</span>
            </div>
            <p className={`mt-0.5 text-[12px] ${alert.mint ? "text-mint" : "text-lilac-mid"}`}>{alert.body}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

export function LiveKicker({ children }: { children: string }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <p className="bento-kicker">{children}</p>
      <LiveDot />
    </div>
  );
}
