import Link from "next/link";
import { ProductBento } from "./ProductBento";

const bullets = [
  "30-second launch on pump.fun",
  "pay a name, not a wallet",
  "up to 10-way splits",
  "gasless-ready claims",
  "launch once, get paid forever",
];

export function Features() {
  return (
    <section className="relative z-10 mx-auto max-w-6xl px-5 pb-8 pt-8 md:px-8">
      <p className="mono-kicker text-sm">NOW LIVE ON PUMP.FUN</p>
      <h2 className="mt-3 text-[36px] font-bold leading-tight tracking-[-0.04em] text-lilac-soft md:text-[60px]">
        fees that follow you.
      </h2>
      <p className="mt-3 max-w-2xl text-[16px] text-[#EAEDFF99] md:text-[28px] md:leading-9">
        never leave fees behind — the launchpad that pays out to a username.
      </p>

      <ProductBento />

      <ul className="mt-10 flex flex-wrap gap-x-6 gap-y-3 text-sm text-lilac-mid">
        {bullets.map((b, i) => (
          <li key={b} className="flex items-center gap-2">
            <span
              className="h-2 w-2 rounded-full"
              style={{ background: i === bullets.length - 1 ? "#21c95e" : "#516af6" }}
            />
            {b}
          </li>
        ))}
      </ul>
    </section>
  );
}

const steps = [
  {
    n: "01",
    title: "launch",
    body: "Name it, ticker it, drop an image. fomogo deploys the bonding curve on pump.fun for you.",
  },
  {
    n: "02",
    title: "route",
    body: "Point creator fees at handles: yours, your team, your community. Any split. Max 10.",
  },
  {
    n: "03",
    title: "accrue",
    body: "Every trade adds to the pot. Fees stream per token and per recipient, in real time.",
  },
  {
    n: "04",
    title: "claim",
    body: "Type the handle, hit claim. Permissionless pump distribution to resolved wallets.",
  },
];

export function Devices() {
  return (
    <section id="devices" className="relative overflow-x-clip scroll-mt-8 px-5 pb-4 pt-16 md:px-8 md:pt-24">
      <p className="mono-kicker text-center text-sm">NOW ON WEB + PHONE</p>
      <h2 className="mt-3 text-center text-[36px] font-bold leading-[1.05] tracking-[-0.04em] text-white md:text-[60px]">
        launch from anywhere.
        <br />
        never miss a payday.
      </h2>
      <p className="mx-auto mt-4 max-w-2xl text-center text-[16px] font-medium leading-7 text-[#9899A3] md:text-[22px]">
        Start a coin on desktop, claim fees on your phone — same @handle, same split.
      </p>
      <div className="device-stage relative mx-auto mt-12 max-w-5xl">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/hero/imac.webp"
          alt="FOMOGO on desktop"
          className="relative z-10 mx-auto w-full select-none"
        />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/hero/iphone.webp"
          alt="FOMOGO on iPhone"
          className="phone-float absolute -right-[4%] bottom-[6%] z-20 w-[42%] max-w-[340px] select-none drop-shadow-[0_30px_60px_rgba(81,106,246,0.28)] md:right-[2%] md:w-[32%] md:max-w-[380px]"
        />
      </div>
    </section>
  );
}

export function HowItWorks() {
  return (
    <section id="how" className="mx-auto max-w-6xl scroll-mt-8 px-5 py-20 md:px-8">
      <h2 className="text-[36px] font-bold tracking-[-0.04em] md:text-[60px]">
        launch once, get paid forever
      </h2>
      <p className="mt-3 text-[16px] text-[#EAEDFF99] md:text-[28px]">
        four steps from an idea to fees in a handle
      </p>
      <div className="mt-12 grid gap-8 md:grid-cols-4">
        {steps.map((step, i) => (
          <div key={step.n} className="relative">
            <div className="mb-4 flex items-center gap-3">
              <span
                className="h-2.5 w-2.5 rounded-full"
                style={{ background: i === 3 ? "#21c95e" : "#516af6" }}
              />
              <span className="h-px flex-1 bg-line-2" />
            </div>
            <p className="mono-kicker text-sm">{step.n}</p>
            <h3 className="mt-2 text-3xl font-bold tracking-tight">{step.title}</h3>
            <p className="mt-3 text-[15px] leading-6 text-muted">{step.body}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

export function MigrateStrip() {
  return (
    <section className="mx-auto max-w-6xl px-5 pb-16 md:px-8">
      <div className="card-panel flex flex-col items-start justify-between gap-6 p-7 md:flex-row md:items-center md:p-10">
        <div className="max-w-xl">
          <p className="mono-kicker text-xs uppercase">ALREADY LAUNCHED?</p>
          <h3 className="mt-2 text-[28px] font-bold leading-tight tracking-tight md:text-[36px]">
            migrate the fees of a coin you already own
          </h3>
          <p className="mt-3 text-muted">
            Paste the mint, sign with the creator wallet, and the fee stream moves to @handles.
            Holders are unaffected.
          </p>
        </div>
        <Link href="/app/migrate" className="btn-primary inline-flex h-12 items-center px-7 text-lg">
          Migrate fees
        </Link>
      </div>
    </section>
  );
}

export function Economics() {
  return (
    <section className="mx-auto max-w-6xl px-5 pb-20 md:px-8">
      <div className="grid gap-8 pt-4 md:grid-cols-3">
        {[
          ["PUMP.FUN CREATOR FEE", "0.30%", "of volume"],
          ["TO YOUR HANDLES", "100%", "of creator fees"],
          ["FOMOGO ROUTING FEE", "0%", "disclosed, not hidden"],
        ].map(([k, v, s]) => (
          <div key={k}>
            <p className="font-mono text-xs tracking-[0.14em] text-muted">{k}</p>
            <p className={`mt-2 text-5xl font-bold tracking-tight ${v === "100%" || v === "0%" ? "text-mint" : ""}`}>
              {v}
            </p>
            <p className="mt-1 text-muted">{s}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

export function SiteFooter() {
  return (
    <footer className="px-5 py-12 md:px-8">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 md:flex-row md:items-start md:justify-between">
        <div>
          <p className="text-2xl font-bold tracking-[-0.05em] text-lilac">fomogo</p>
          <p className="mt-2 max-w-sm text-sm leading-6 text-muted">
            FOMOGO is an independent product. Not affiliated with FOMO Labs, fomo.family, or
            fomo.claims. Memecoins can go to zero. Not financial advice.
          </p>
        </div>
        <div className="flex gap-8 text-sm font-bold text-lilac">
          <Link href="/app/launch">App</Link>
          <a href="https://x.com/FomoGoApp" target="_blank" rel="noreferrer">
            @FomoGoApp
          </a>
          <a
            href="https://github.com/pump-fun/pump-public-docs/blob/main/docs/instructions/CREATOR_FEE_SHARING.md"
            target="_blank"
            rel="noreferrer"
          >
            Docs
          </a>
          <a href="https://pump.fun" target="_blank" rel="noreferrer">
            pump.fun
          </a>
        </div>
      </div>
    </footer>
  );
}
