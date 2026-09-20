import type { CSSProperties } from "react";
import Link from "next/link";

const avatars = [
  { src: "/avatars/pointfarmcap.jpg", handle: "@pointfarmcap", size: 72, radius: 1 },
  { src: "/avatars/DongBnb.jpg", handle: "@DongBnb", size: 42, radius: 1 },
  { src: "/avatars/The__Solstice.jpg", handle: "@The__Solstice", size: 48, radius: 1 },
  { src: "/avatars/0xace_eth.jpg", handle: "@0xace_eth", size: 38, radius: 1 },
  { src: "/avatars/AustinWhite.jpg", handle: "@AustinWhite", size: 54, radius: 1 },
  { src: "/avatars/needbigwinnow.jpg", handle: "@needbigwinnow", size: 36, radius: 1 },
  { src: "/avatars/theveeman.jpg", handle: "@theveeman", size: 44, radius: 1 },
  { src: "/avatars/onchaincutie.jpg", handle: "@onchaincutie", size: 40, radius: 1 },
  { src: "/avatars/0xdetweiler.jpg", handle: "@0xdetweiler", size: 60, radius: 1 },
  { src: "/avatars/Pasterniq.jpg", handle: "@Pasterniq", size: 38, radius: 1 },
  { src: "/avatars/OhMyJack.jpg", handle: "@OhMyJack", size: 50, radius: 1 },
  { src: "/avatars/_realgabe.jpg", handle: "@_realgabe", size: 36, radius: 1 },
  { src: "/avatars/BonkGay.jpg", handle: "@BonkGay", size: 46, radius: 1 },
  { src: "/avatars/macdegods.jpg", handle: "@macdegods", size: 40, radius: 1 },
  { src: "/avatars/Pyro.png", handle: "@Pyro", size: 64, radius: 1 },
  { src: "/avatars/Enzoferrari_eth.jpg", handle: "@Enzoferrari_eth", size: 38, radius: 1 },
];

export function CommunityOrbit() {
  return (
    <section
      id="community"
      className="orbit-section relative isolate min-h-[100svh] overflow-hidden"
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/hero/crowd-bg-gpt2.png"
        alt=""
        className="orbit-crowd-left pointer-events-none absolute inset-y-0 left-0 h-full w-[54%] object-cover object-[left_center]"
      />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/hero/crowd-bg-portrait.png"
        alt=""
        className="orbit-crowd-right pointer-events-none absolute inset-y-0 right-0 h-full w-[54%] object-cover object-[right_68%]"
      />
      <div className="pointer-events-none absolute inset-0 bg-[#060510]/12" />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-void to-transparent" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-void to-transparent" />

      <div className="relative z-10 mx-auto flex min-h-[100svh] w-full items-center justify-center px-5 py-20">
        <div className="orbit-stage relative aspect-square w-[min(100vw,920px)]">
          <div className="orbit-path" aria-hidden />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/brand/logo-primary.png"
            alt=""
            className="orbit-mark pointer-events-none rounded-full bg-[#12111a] object-contain p-1 ring-1 ring-[#cbd0eb33]"
          />
          <div className="orbit-spin">
            {avatars.map((avatar, i) => (
              <div
                key={avatar.src}
                className="orbit-slot"
                style={
                  {
                    "--orbit-i": String(i),
                    "--orbit-n": String(avatars.length),
                    "--orbit-size": `${avatar.size}px`,
                    "--orbit-radius": String(avatar.radius),
                  } as CSSProperties
                }
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={avatar.src} alt={avatar.handle} className="orbit-face" />
              </div>
            ))}
          </div>

          <div className="relative z-10 flex h-full flex-col items-center justify-center text-center">
            <h2 className="max-w-[14ch] text-[40px] font-bold leading-[1.02] tracking-[-0.045em] text-white md:text-[64px]">
              a launchpad
              <br />
              for the rest of us
            </h2>
            <p className="mt-4 max-w-md text-[15px] font-medium text-[#9899A3] md:text-[20px]">
              join creators routing fees to @handles on fomogo
            </p>
            <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row">
              <Link
                href="/app/launch"
                className="inline-flex h-12 w-[12.5rem] items-center justify-center rounded-full bg-[#516af6] text-lg font-bold text-white transition hover:bg-[#6a80ff]"
              >
                Launch a token
              </Link>
              <a
                href="https://x.com/FomoGoApp"
                target="_blank"
                rel="noreferrer"
                className="inline-flex h-12 w-[12.5rem] items-center justify-center rounded-full bg-[#1b1a27] text-lg font-bold text-white ring-1 ring-[#cbd0eb29] transition hover:bg-[#221f30]"
              >
                Follow @FomoGoApp
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
