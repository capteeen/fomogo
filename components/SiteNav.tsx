"use client";

import Link from "next/link";
import { LogoLockup } from "./Brand";
import { WalletChip } from "./WalletChip";

const links = [
  { href: "/#devices", label: "Web + phone" },
  { href: "/#community", label: "Community" },
  { href: "/#how", label: "How it works" },
  { href: "https://x.com/FomoGoApp", label: "@FomoGoApp", external: true },
];

export function SiteNav() {
  return (
    <header className="absolute inset-x-0 top-0 z-30 px-4 pt-4 md:px-8">
      <nav className="mx-auto flex max-w-6xl items-center justify-between">
        <LogoLockup />
        <div className="flex items-center gap-2 md:gap-3">
          {links.map((link) =>
            link.external ? (
              <a
                key={link.href}
                href={link.href}
                target="_blank"
                rel="noreferrer"
                className="hidden text-[14px] font-bold text-lilac md:inline"
              >
                {link.label}
              </a>
            ) : (
              <Link
                key={link.href}
                href={link.href}
                className="hidden text-[14px] font-bold text-lilac md:inline"
              >
                {link.label}
              </Link>
            ),
          )}
          <Link
            href="/app/launch"
            className="btn-ghost hidden h-10 items-center px-5 text-[13px] md:inline-flex"
          >
            Open app
          </Link>
          <WalletChip />
        </div>
      </nav>
    </header>
  );
}
