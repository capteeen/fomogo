import { DEMO_PROFILES, type DemoProfile } from "./profiles";

export type { DemoProfile };
export { DEMO_PROFILES };

export type LaunchRecord = {
  mint: string;
  name: string;
  ticker: string;
  description?: string;
  image?: string;
  creator: string;
  shareholders: { handle: string; wallet: string; bps: number }[];
  signature?: string;
  createdAt: string;
};

export type HandleRecord = {
  handle: string;
  wallet: string;
  verifiedAt: string;
};

export type FeedItem = {
  id: string;
  kind: "launch" | "claim" | "route";
  handle: string;
  body: string;
  ticker?: string;
  delta?: string;
  positive?: boolean;
  age: string;
};

export type LeaderboardRow = {
  rank: number;
  handle: string;
  name: string;
  avatar?: string;
  fees: string;
  tokens: number;
};

export type AlertItem = {
  id: string;
  title: string;
  body: string;
  time: string;
  icon: string;
  mint: boolean;
};

export function profileFor(handle: string): DemoProfile | undefined {
  const key = handle.startsWith("@") ? handle : `@${handle}`;
  return DEMO_PROFILES.find((p) => p.handle.toLowerCase() === key.toLowerCase());
}

const TICKERS = ["HANDS", "ORBIT", "TIPONS", "JACK", "BONKGO", "SKUNKY", "FOMO", "PUMP", "GO", "AURA"] as const;
const AGES = ["now", "12s", "38s", "1m", "2m", "4m", "7m", "11m", "18m", "34m", "1h", "2h", "3h", "5h"];
const KINDS = ["launch", "claim", "route"] as const;

function solFrom(seed: number) {
  return ((seed % 97) + 8) / 100;
}

export function makeFeedEvent(seed: number, kind?: FeedItem["kind"]): FeedItem {
  const profile = DEMO_PROFILES[seed % DEMO_PROFILES.length];
  const other = DEMO_PROFILES[(seed * 11 + 5) % DEMO_PROFILES.length];
  const ticker = TICKERS[seed % TICKERS.length];
  const resolved = kind ?? KINDS[seed % 3];
  const sol = solFrom(seed);
  const age = AGES[seed % AGES.length];
  const split =
    other.handle.toLowerCase() === profile.handle.toLowerCase()
      ? profile.handle
      : `${profile.handle}, ${other.handle}`;

  if (resolved === "launch") {
    return {
      id: `evt-${seed}`,
      kind: "launch",
      handle: profile.handle,
      body: `launched $${ticker} · fees → ${split}`,
      ticker,
      age,
    };
  }

  if (resolved === "claim") {
    return {
      id: `evt-${seed}`,
      kind: "claim",
      handle: profile.handle,
      body: `claimed ${sol.toFixed(2)} SOL from $${ticker}`,
      ticker,
      delta: `+${sol.toFixed(2)} SOL`,
      positive: true,
      age,
    };
  }

  return {
    id: `evt-${seed}`,
    kind: "route",
    handle: profile.handle,
    body: `locked fees on $${ticker} → ${split}`,
    ticker,
    age,
  };
}

export const DEMO_FEED: FeedItem[] = Array.from({ length: 28 }, (_, i) => makeFeedEvent(i + 1));

const TOP_FEES: Record<string, { fees: number; tokens: number }> = {
  "@pointfarmcap": { fees: 42.1, tokens: 3 },
  "@The__Solstice": { fees: 11.04, tokens: 1 },
  "@theveeman": { fees: 8.62, tokens: 4 },
  "@0xdetweiler": { fees: 3.19, tokens: 2 },
  "@Pasterniq": { fees: 1.88, tokens: 2 },
  "@OhMyJack": { fees: 1.44, tokens: 1 },
  "@TheOnlyOMP": { fees: 0.97, tokens: 2 },
  "@BonkGay": { fees: 0.61, tokens: 1 },
  "@Pyro": { fees: 0.28, tokens: 1 },
};

function seedFee(handle: string, index: number) {
  const known = TOP_FEES[handle];
  if (known) return known;
  return {
    fees: Math.max(0.01, 0.255 - index * 0.0032 + ((index * 13) % 7) * 0.004),
    tokens: 1 + (index % 4),
  };
}

export const DEMO_LEADERBOARD: LeaderboardRow[] = DEMO_PROFILES.map((profile, index) => {
  const stats = seedFee(profile.handle, index);
  return {
    rank: 0,
    handle: profile.handle,
    name: profile.name,
    avatar: profile.avatar,
    fees: stats.fees.toFixed(2),
    tokens: stats.tokens,
  };
})
  .sort((a, b) => parseFloat(b.fees) - parseFloat(a.fees))
  .map((row, index) => ({ ...row, rank: index + 1 }));

const ALERT_ICONS = ["/features/icon-fomogo.svg", "/features/token-hands.svg", "/features/token-orbit.svg"];

export function makeAlert(seed: number): AlertItem {
  const profile = DEMO_PROFILES[seed % DEMO_PROFILES.length];
  const ticker = TICKERS[seed % TICKERS.length];
  const sol = solFrom(seed);
  const icon = ALERT_ICONS[seed % ALERT_ICONS.length];
  const time = seed % 5 === 0 ? "now" : `${9 - (seed % 3)}:${(10 + (seed % 50)).toString().padStart(2, "0")} AM`;
  const flavor = seed % 4;

  if (flavor === 0) {
    return {
      id: `al-${seed}`,
      title: `$${ticker} fee is up ${(3 + (seed % 7)).toFixed(2)}%`,
      body: `${12 + (seed % 38)} creators earned ${sol.toFixed(2)} SOL`,
      time,
      icon,
      mint: true,
    };
  }
  if (flavor === 1) {
    return {
      id: `al-${seed}`,
      title: `Fee hit ${profile.handle} on $${ticker}`,
      body: `+${sol.toFixed(2)} SOL ready to claim`,
      time,
      icon,
      mint: true,
    };
  }
  if (flavor === 2) {
    return {
      id: `al-${seed}`,
      title: `Share lock finalized`,
      body: `$${ticker} split is live · ${profile.handle}`,
      time,
      icon,
      mint: false,
    };
  }
  return {
    id: `al-${seed}`,
    title: `$${ticker} just routed fees`,
    body: `${profile.handle} paid · ${sol.toFixed(2)} SOL`,
    time,
    icon,
    mint: true,
  };
}

export const DEMO_ALERTS = [
  { id: "a1", unread: true, title: "Fee hit @you on $HANDS", meta: "+0.012 SOL · 2m" },
  { id: "a2", unread: true, title: "Share lock finalized", meta: "$TIPONS · 18m" },
  { id: "a3", unread: false, title: "Claim available", meta: "0.41 SOL sitting in vault" },
  { id: "a4", unread: false, title: "New route on $ORBIT", meta: "1h" },
];
