import Link from "next/link";

export function Hero() {
  return (
    <section className="relative min-h-[100svh] overflow-x-clip">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/hero/space-bg.webp"
        alt=""
        className="pointer-events-none absolute inset-0 h-[calc(100%+140px)] w-full object-cover object-[center_18%]"
      />
      <div className="pointer-events-none absolute inset-0 z-0 grid place-items-center">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/hero/orbit-outer.webp"
          alt=""
          className="hero-orbit h-auto w-[min(52rem,86vmin)] max-w-none opacity-75 mix-blend-screen"
        />
      </div>
      <div className="pointer-events-none absolute bottom-[-8px] left-1/2 z-[1] -translate-x-1/2">
        <div className="hero-float relative">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/hero/astronaut-cutout.webp"
            alt=""
            className="relative z-10 hidden h-[250px] w-auto md:block"
          />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/hero/astronaut-mobile-cutout.webp"
            alt=""
            className="relative z-10 h-[220px] w-auto md:hidden"
          />
        </div>
      </div>

      <div className="relative z-10 mx-auto flex min-h-[100svh] max-w-4xl flex-col items-center px-5 pb-52 pt-36 text-center md:pt-40">
        <h1 className="font-bold leading-none tracking-[-0.055em] text-[#CBD0EB] text-[56px] md:text-[124px]">
          fomogo
        </h1>
        <p className="mt-5 text-[24px] font-bold leading-7 tracking-[-0.02em] text-white md:mt-6 md:text-[40px] md:leading-12">
          where launches become paydays.
        </p>
        <p className="mt-4 max-w-xl text-[16px] font-medium leading-7 tracking-normal text-[#9899A3] md:text-[22px]">
          Launch on pump.fun, route creator fees to any @handle, claim in one tap.
        </p>
        <div className="hero-bloom mt-8 flex w-full flex-col items-center justify-center gap-3 sm:flex-row">
          <Link
            href="/app/launch"
            className="btn-primary inline-flex h-12 w-[12.5rem] items-center justify-center px-8 text-lg"
          >
            Launch a token
          </Link>
          <Link
            href="/app/claim"
            className="btn-ghost inline-flex h-12 w-[12.5rem] items-center justify-center px-8 text-lg"
          >
            Claim my fees
          </Link>
        </div>
        <p className="mt-8 text-[13px] text-[#D1D8FF80] md:text-[15px]">
          <span className="font-bold text-ink">$0.00</span> fees routed ·{" "}
          <span className="font-bold text-ink">0</span> tokens launched ·{" "}
          <span className="font-bold text-ink">0</span> handles
        </p>
      </div>
      <div className="hero-veil" aria-hidden />
    </section>
  );
}
