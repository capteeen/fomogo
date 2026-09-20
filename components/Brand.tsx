"use client";

import Link from "next/link";

export function BrandMark({ size = 32 }: { size?: number }) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src="/brand/logo-primary.png"
      alt="FOMOGO"
      width={size}
      height={size}
      className="shrink-0 object-contain"
      style={{ width: size, height: size }}
    />
  );
}

export function Wordmark({ className = "" }: { className?: string }) {
  return (
    <span
      className={`font-bold tracking-[-0.05em] text-lilac ${className}`}
      style={{ fontFamily: "Aeonik, sans-serif" }}
    >
      fomogo
    </span>
  );
}

export function LogoLockup({ compact = false }: { compact?: boolean }) {
  return (
    <Link href="/" className="flex items-center gap-2.5">
      <BrandMark size={compact ? 28 : 32} />
      <Wordmark className={compact ? "text-[20px]" : "text-[24px]"} />
    </Link>
  );
}
