import Link from "next/link";
import { DEMO_LEADERBOARD } from "@/lib/demo";

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

function Avatar({ src, alt, className = "h-10 w-10" }: { src: string; alt: string; className?: string }) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={src} alt={alt} className={`shrink-0 rounded-full object-cover ${className}`} />
  );
}

function WalletMark() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
      <rect x="3" y="6" width="18" height="13" rx="3" stroke="currentColor" strokeWidth="1.8" />
      <path d="M3 10h18" stroke="currentColor" strokeWidth="1.8" />
      <circle cx="16.5" cy="14.5" r="1.2" fill="currentColor" />
    </svg>
  );
}

function PhantomMark() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M12 3c4.8 0 8.5 3.2 8.5 7.6 0 5.4-3.7 9.7-8.5 10.4C7.2 20.3 3.5 16 3.5 10.6 3.5 6.2 7.2 3 12 3Zm-3.2 8.2a1.3 1.3 0 1 0 0-2.6 1.3 1.3 0 0 0 0 2.6Zm6.4 0a1.3 1.3 0 1 0 0-2.6 1.3 1.3 0 0 0 0 2.6Z" />
    </svg>
  );
}

const board = DEMO_LEADERBOARD.slice(0, 8);

function LeaderboardCard() {
  return (
    <article className="bento-card relative flex h-full min-h-[390px] flex-col overflow-hidden p-6 md:p-7">
      <p className="bento-kicker">Leaderboard</p>
      <h3 className="mt-3 max-w-[16ch] text-[28px] font-bold leading-[1.12] tracking-[-0.04em] md:text-[32px]">
        become a legend, top the leaderboard
      </h3>
      <ul className="mt-5 flex-1 space-y-2.5">
        {board.map((row) => (
          <li key={row.handle} className="flex items-center gap-2.5">
            <Medal rank={row.rank} />
            <Avatar src={row.avatar ?? "/avatars/pointfarmcap.jpg"} alt="" className="h-9 w-9" />
            <div className="min-w-0 flex-1">
              <p className="truncate text-[15px] font-bold leading-tight">{row.name}</p>
              <p className="truncate text-[13px] text-muted">{row.handle}</p>
            </div>
            <p className="font-mono text-[13px] font-bold tabular-nums text-mint md:text-[14px]">
              +{row.fees} SOL
            </p>
          </li>
        ))}
      </ul>
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-14 bg-gradient-to-t from-[#0e0e16]" />
    </article>
  );
}

function FeedCard() {
  return (
    <article className="bento-card flex h-full min-h-[390px] flex-col overflow-hidden p-6 md:p-7">
      <p className="bento-kicker">Feed</p>
      <h3 className="mt-3 max-w-[14ch] text-[28px] font-bold leading-[1.12] tracking-[-0.04em] md:text-[32px]">
        discover launches and follow top creators
      </h3>
      <div className="relative mt-6 flex-1">
        <div className="space-y-2.5 rounded-2xl border border-white/5 bg-[#08080f] p-2.5">
          <div className="rounded-xl px-2 py-2">
            <div className="flex items-center gap-2">
              <Avatar src="/features/avatar-skunk.jpg" alt="" />
              <p className="text-[13px] font-bold">skunk</p>
              <span className="rounded-md bg-accent px-1.5 py-0.5 text-[10px] font-bold">Launch</span>
              <span className="ml-auto font-mono text-[11px] text-dim">2m</span>
            </div>
            <p className="mt-1.5 pl-12 text-[13px] text-lilac-mid">launched $HANDS · fees → @skunk</p>
          </div>
          <div className="rounded-xl bg-[#12121c] px-2 py-2.5">
            <div className="flex items-center gap-2">
              <Avatar src="/features/avatar-alice.jpg" alt="" />
              <p className="text-[13px] font-bold">alice</p>
              <span className="rounded-md bg-mint/15 px-1.5 py-0.5 text-[10px] font-bold text-mint">Claim</span>
              <span className="ml-auto font-mono text-[11px] text-dim">11m</span>
            </div>
            <div className="mt-2 flex items-center gap-2.5 rounded-xl bg-[#0a0a12] px-2.5 py-2">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/features/token-hands.svg" alt="" className="h-8 w-8 rounded-full" />
              <div className="min-w-0 flex-1">
                <p className="text-[12px] font-bold">
                  Position <span className="text-mint">Claim</span>
                </p>
                <p className="text-[11px] text-muted">$HANDS · 0.41 SOL</p>
              </div>
              <div className="text-right">
                <p className="text-[13px] font-bold">+0.41</p>
                <p className="text-[11px] font-bold text-mint">+12.3%</p>
              </div>
            </div>
          </div>
          <div className="rounded-xl px-2 py-2 opacity-50">
            <div className="flex items-center gap-2">
              <Avatar src="/features/avatar-whale.jpg" alt="" />
              <p className="text-[13px] font-bold">whale</p>
              <span className="rounded-md bg-coral/80 px-1.5 py-0.5 text-[10px] font-bold">Route</span>
              <span className="ml-auto font-mono text-[11px] text-dim">1h</span>
            </div>
            <p className="mt-1.5 pl-12 text-[13px] text-lilac-mid">locked fees on $ORBIT</p>
          </div>
        </div>
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-[#0e0e16]" />
      </div>
    </article>
  );
}

const alerts = [
  {
    title: "$ORBIT fee is up 5.98%",
    body: "50 top creators earned 8.20 SOL",
    time: "9:41 AM",
    icon: "/features/icon-fomogo.svg",
    mint: true,
  },
  {
    title: "Fee hit @you on $HANDS",
    body: "+0.41 SOL ready to claim",
    time: "9:38 AM",
    icon: "/features/token-hands.svg",
    mint: true,
  },
  {
    title: "Share lock finalized",
    body: "$TIPONS split is live on-chain",
    time: "9:22 AM",
    icon: "/features/icon-fomogo.svg",
    mint: false,
  },
  {
    title: "$SKUNKY just routed fees",
    body: "3 handles paid · 1.02 SOL",
    time: "9:04 AM",
    icon: "/features/token-orbit.svg",
    mint: true,
  },
];

function AlertsCard() {
  return (
    <article className="bento-card relative flex h-full min-h-[390px] flex-col overflow-hidden p-6 md:p-7">
      <p className="bento-kicker">Alerts</p>
      <h3 className="mt-3 max-w-[16ch] text-[28px] font-bold leading-[1.12] tracking-[-0.04em] md:text-[32px]">
        real time notifications when fees hit your name
      </h3>
      <div className="mt-5 flex flex-1 flex-col justify-end gap-2 pb-1">
        {alerts.map((alert) => (
          <div
            key={alert.title}
            className="flex w-full items-start gap-3 rounded-2xl border border-white/10 bg-[#1a1a24]/90 px-3.5 py-2.5 shadow-[0_10px_28px_#0008] backdrop-blur-md"
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
    </article>
  );
}

function OnboardingCard() {
  return (
    <article className="bento-card relative flex min-h-[390px] flex-col overflow-hidden p-6 md:p-7">
      <p className="bento-kicker">Easy onboarding</p>
      <h3 className="mt-3 max-w-[14ch] text-[28px] font-bold leading-[1.12] tracking-[-0.04em] md:text-[32px]">
        connect a wallet in an instant
      </h3>
      <div className="relative mt-auto flex flex-col items-center pb-4 pt-10">
        <div className="w-full max-w-[260px] space-y-3">
          <Link
            href="/app/launch"
            className="flex h-12 w-full items-center justify-center gap-2 rounded-full bg-white text-[15px] font-bold text-black"
          >
            <PhantomMark />
            Connect Phantom
          </Link>
          <Link
            href="/app/launch"
            className="flex h-12 w-full items-center justify-center gap-2 rounded-full bg-[#12121c] text-[15px] font-bold text-white ring-1 ring-white/10"
          >
            <WalletMark />
            Connect wallet
          </Link>
        </div>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/features/finger-cutout.png"
          alt=""
          className="pointer-events-none absolute -bottom-6 left-[18%] w-[118px] drop-shadow-[0_12px_18px_#000c] md:left-[22%]"
        />
      </div>
    </article>
  );
}

function ComplexityCard() {
  return (
    <article className="bento-card relative flex min-h-[390px] flex-col overflow-hidden p-6 md:p-7">
      <p className="bento-kicker">Zero complexity</p>
      <h3 className="mt-3 max-w-[14ch] text-[28px] font-bold leading-[1.12] tracking-[-0.04em] md:text-[32px]">
        handles, not wallets
      </h3>
      <div className="relative mt-4 min-h-[200px] flex-1">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/features/glass-cards.png"
          alt="Iridescent glass cards"
          className="absolute inset-x-[-8%] bottom-[-18%] w-[116%] max-w-none"
        />
      </div>
    </article>
  );
}

function ClaimCard() {
  return (
    <article className="bento-card flex min-h-[390px] flex-col overflow-hidden p-6 md:p-7">
      <p className="bento-kicker">One tap to claim</p>
      <h3 className="mt-3 max-w-[12ch] text-[28px] font-bold leading-[1.12] tracking-[-0.04em] md:text-[32px]">
        fees in your wallet
      </h3>
      <div className="relative mt-auto translate-y-3">
        <div className="mx-auto w-full max-w-[250px] rounded-t-2xl border border-white/8 border-b-0 bg-[#14141e] px-3.5 pb-6 pt-3 shadow-[0_-8px_40px_#0008]">
          <div className="flex text-[13px] font-bold">
            <span className="flex-1 border-b-2 border-white pb-2 text-center">Claim</span>
            <span className="flex-1 border-b border-white/10 pb-2 text-center text-dim">Share</span>
          </div>
          <div className="mt-4 flex items-end justify-between">
            <p className="text-[40px] font-bold leading-none tracking-tight">1.02</p>
            <p className="pb-1 text-[12px] text-muted">SOL claimable</p>
          </div>
          <div className="mt-4 flex gap-1.5">
            {["0.25", "0.5", "1.0", "Max"].map((chip, i) => (
              <span
                key={chip}
                className={`grid h-8 flex-1 place-items-center rounded-lg text-[12px] font-bold ${
                  i === 2 ? "bg-white/10 text-white" : "bg-white/5 text-muted"
                }`}
              >
                {chip}
              </span>
            ))}
          </div>
          <div className="mt-3 flex items-center justify-between text-[11px] text-muted">
            <span>to connected wallet</span>
            <span className="text-mint">$0 routing fee</span>
          </div>
          <Link
            href="/app/claim"
            className="mt-2 flex h-11 w-full items-center justify-center rounded-full bg-white text-[15px] font-bold text-black"
          >
            Claim fees
          </Link>
        </div>
      </div>
    </article>
  );
}

export function ProductBento() {
  return (
    <div className="mt-10 grid gap-3.5 md:grid-cols-3">
      <LeaderboardCard />
      <FeedCard />
      <AlertsCard />
      <OnboardingCard />
      <ComplexityCard />
      <ClaimCard />
    </div>
  );
}
