"use client";

import { DEMO_ALERTS } from "@/lib/demo";

export default function AlertsPage() {
  return (
    <div className="mx-auto max-w-lg">
      <h1 className="text-2xl font-bold">Alerts</h1>
      <p className="mt-1 text-sm text-muted">Fee-hit / new-route / claimable. Prefs: push coming later.</p>
      <div className="mt-5 space-y-2">
        {DEMO_ALERTS.map((alert) => (
          <div
            key={alert.id}
            className="flex items-center gap-3 rounded-[16px] border border-line bg-surface px-4 py-3"
          >
            <span
              className={`grid h-8 w-8 place-items-center rounded-lg ${
                alert.unread ? "bg-accent" : "bg-surface-3"
              }`}
            >
              ✓
            </span>
            <div className="min-w-0 flex-1">
              <p className="font-bold">{alert.title}</p>
              <p className="font-mono text-xs text-dim">{alert.meta}</p>
            </div>
            {alert.unread && <span className="h-2 w-2 rounded-full bg-accent" />}
          </div>
        ))}
      </div>
    </div>
  );
}
