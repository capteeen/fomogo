import Link from "next/link";
import { LiveAlerts, LiveBoard, LiveFeed, LiveKicker } from "@/components/LiveSocial";

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

function LeaderboardCard() {
  return (
    <article className="bento-card relative flex h-full min-h-[390px] flex-col overflow-hidden p-6 md:p-7">
      <LiveKicker>Leaderboard</LiveKicker>
      <h3 className="mt-3 max-w-[16ch] text-[28px] font-bold leading-[1.12] tracking-[-0.04em] md:text-[32px]">
        become a legend, top the leaderboard
      </h3>
      <div className="mt-5 flex-1">
        <LiveBoard variant="card" max={8} interval={2800} />
      </div>
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-14 bg-gradient-to-t from-[#0e0e16]" />
    </article>
  );
}

function FeedCard() {
  return (
    <article className="bento-card flex h-full min-h-[390px] flex-col overflow-hidden p-6 md:p-7">
      <LiveKicker>Feed</LiveKicker>
      <h3 className="mt-3 max-w-[14ch] text-[28px] font-bold leading-[1.12] tracking-[-0.04em] md:text-[32px]">
        discover launches and follow top creators
      </h3>
      <div className="relative mt-6 flex-1">
        <LiveFeed variant="card" max={4} interval={2400} />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-[#0e0e16]" />
      </div>
    </article>
  );
}

function AlertsCard() {
  return (
    <article className="bento-card relative flex h-full min-h-[390px] flex-col overflow-hidden p-6 md:p-7">
      <LiveKicker>Alerts</LiveKicker>
      <h3 className="mt-3 max-w-[16ch] text-[28px] font-bold leading-[1.12] tracking-[-0.04em] md:text-[32px]">
        real time notifications when fees hit your name
      </h3>
      <LiveAlerts interval={3200} />
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
