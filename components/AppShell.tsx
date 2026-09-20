"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LogoLockup } from "@/components/Brand";
import { WalletChip } from "@/components/WalletChip";

const tabs = [
  { href: "/app/feed", label: "Feed" },
  { href: "/app/launch", label: "Launch" },
  { href: "/app/route", label: "Route" },
  { href: "/app/migrate", label: "Migrate" },
  { href: "/app/claim", label: "Claim" },
  { href: "/app/leaderboard", label: "Board" },
  { href: "/app/alerts", label: "Alerts" },
  { href: "/app/account", label: "You" },
];

export function AppShell({ children }: { children: React.ReactNode }) {
  const path = usePathname();
  return (
    <div className="min-h-svh bg-void">
      <header className="sticky top-0 z-20 border-b border-line bg-[#060510cc] backdrop-blur-[12px]">
        <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4">
          <LogoLockup compact />
          <div className="hidden items-center gap-1 md:flex">
            {tabs.map((tab) => {
              const active = path === tab.href;
              return (
                <Link
                  key={tab.href}
                  href={tab.href}
                  className={`rounded-lg px-3 py-1.5 text-[13px] font-bold ${
                    active ? "bg-surface-3 text-ink" : "text-lilac hover:text-ink"
                  }`}
                >
                  {tab.label}
                </Link>
              );
            })}
          </div>
          <WalletChip />
        </div>
      </header>
      <div className="mx-auto max-w-5xl px-4 py-6 pb-24 md:pb-10">{children}</div>
      <nav className="fixed inset-x-0 bottom-0 z-20 border-t border-line bg-[#060510f2] backdrop-blur-[12px] md:hidden">
        <div className="grid grid-cols-4 text-center text-[11px] font-bold">
          {[
            { href: "/app/claim", label: "Fees" },
            { href: "/app/launch", label: "Launch" },
            { href: "/app/migrate", label: "Migrate" },
            { href: "/app/account", label: "You" },
          ].map((tab) => (
            <Link
              key={tab.href}
              href={tab.href}
              className={`py-3 ${path === tab.href ? "text-accent" : "text-muted"}`}
            >
              {tab.label}
            </Link>
          ))}
        </div>
      </nav>
    </div>
  );
}
