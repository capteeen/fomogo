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

export type DemoProfile = {
  handle: string;
  name: string;
  avatar: string;
};

export const DEMO_PROFILES: DemoProfile[] = [
  { handle: "@pointfarmcap", name: "point farm capital", avatar: "/avatars/pointfarmcap.jpg" },
  { handle: "@The__Solstice", name: "TheS◎Lstice", avatar: "/avatars/The__Solstice.jpg" },
  { handle: "@theveeman", name: "Vee", avatar: "/avatars/theveeman.jpg" },
  { handle: "@0xdetweiler", name: "Theo", avatar: "/avatars/0xdetweiler.jpg" },
  { handle: "@Pasterniq", name: "Pasterniq", avatar: "/avatars/Pasterniq.jpg" },
  { handle: "@OhMyJack", name: "OhMyJack", avatar: "/avatars/OhMyJack.jpg" },
  { handle: "@TheOnlyOMP", name: "Old Man Pervert", avatar: "/avatars/TheOnlyOMP.jpg" },
  { handle: "@BonkGay", name: "BonkGay", avatar: "/avatars/BonkGay.jpg" },
  { handle: "@Pyro", name: "Pyro", avatar: "/avatars/Pyro.png" },
];

export function profileFor(handle: string): DemoProfile | undefined {
  const key = handle.startsWith("@") ? handle : `@${handle}`;
  return DEMO_PROFILES.find((p) => p.handle.toLowerCase() === key.toLowerCase());
}

export const DEMO_FEED: FeedItem[] = [
  {
    id: "1",
    kind: "launch",
    handle: "@pointfarmcap",
    body: "launched $HANDS · fees → @pointfarmcap, @theveeman",
    ticker: "HANDS",
    age: "2m",
  },
  {
    id: "2",
    kind: "claim",
    handle: "@The__Solstice",
    body: "claimed 0.41 SOL from $TIPONS",
    ticker: "TIPONS",
    delta: "+0.41 SOL",
    positive: true,
    age: "11m",
  },
  {
    id: "3",
    kind: "route",
    handle: "@0xdetweiler",
    body: "locked a 3-way split on $SKUNKY",
    ticker: "SKUNKY",
    age: "34m",
  },
  {
    id: "4",
    kind: "launch",
    handle: "@theveeman",
    body: "launched $ORBIT · fees → @theveeman",
    ticker: "ORBIT",
    age: "1h",
  },
  {
    id: "5",
    kind: "claim",
    handle: "@Pasterniq",
    body: "claimed 1.02 SOL from $HANDS",
    ticker: "HANDS",
    delta: "+1.02 SOL",
    positive: true,
    age: "2h",
  },
  {
    id: "6",
    kind: "launch",
    handle: "@OhMyJack",
    body: "launched $JACK · fees → @OhMyJack, @Pyro",
    ticker: "JACK",
    age: "3h",
  },
  {
    id: "7",
    kind: "route",
    handle: "@TheOnlyOMP",
    body: "locked fees on $TIPONS → @TheOnlyOMP, @BonkGay",
    ticker: "TIPONS",
    age: "5h",
  },
  {
    id: "8",
    kind: "launch",
    handle: "@BonkGay",
    body: "launched $BONKGO · fees → @BonkGay",
    ticker: "BONKGO",
    age: "8h",
  },
  {
    id: "9",
    kind: "claim",
    handle: "@Pyro",
    body: "claimed 0.28 SOL from $ORBIT",
    ticker: "ORBIT",
    delta: "+0.28 SOL",
    positive: true,
    age: "12h",
  },
];

const LEADERBOARD_STATS = [
  { handle: "@pointfarmcap", fees: "42.10", tokens: 3 },
  { handle: "@The__Solstice", fees: "11.04", tokens: 1 },
  { handle: "@theveeman", fees: "8.62", tokens: 4 },
  { handle: "@0xdetweiler", fees: "3.19", tokens: 2 },
  { handle: "@Pasterniq", fees: "1.88", tokens: 2 },
  { handle: "@OhMyJack", fees: "1.44", tokens: 1 },
  { handle: "@TheOnlyOMP", fees: "0.97", tokens: 2 },
  { handle: "@BonkGay", fees: "0.61", tokens: 1 },
  { handle: "@Pyro", fees: "0.28", tokens: 1 },
] as const;

export const DEMO_LEADERBOARD = LEADERBOARD_STATS.map((row, i) => {
  const profile = profileFor(row.handle);
  return {
    rank: i + 1,
    handle: profile?.handle ?? row.handle,
    name: profile?.name ?? row.handle,
    avatar: profile?.avatar,
    fees: row.fees,
    tokens: row.tokens,
  };
});

export const DEMO_ALERTS = [
  { id: "a1", unread: true, title: "Fee hit @you on $HANDS", meta: "+0.012 SOL · 2m" },
  { id: "a2", unread: true, title: "Share lock finalized", meta: "$TIPONS · 18m" },
  { id: "a3", unread: false, title: "Claim available", meta: "0.41 SOL sitting in vault" },
  { id: "a4", unread: false, title: "New route on $ORBIT", meta: "1h" },
];
