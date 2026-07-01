import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { PageHeader } from "@/components/layout/page-header";
import { BarChart3 } from "lucide-react";
import { getHistory, type HistoryItem } from "@/lib/guest-store";

export const Route = createFileRoute("/_app/analytics")({
  head: () => ({ meta: [{ title: "Analytics — Chambers OS" }] }),
  component: Analytics,
});

function Analytics() {
  const [items, setItems] = useState<HistoryItem[]>([]);
  useEffect(() => {
    const refresh = () => setItems(getHistory());
    refresh();
    window.addEventListener("chambers:history-changed", refresh);
    return () => window.removeEventListener("chambers:history-changed", refresh);
  }, []);

  const byFeature = items.reduce<Record<string, number>>((acc, h) => {
    acc[h.feature] = (acc[h.feature] || 0) + 1;
    return acc;
  }, {});

  // Last 7 days bar data
  const days = Array.from({ length: 7 }).map((_, i) => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    d.setDate(d.getDate() - (6 - i));
    return d;
  });
  const perDay = days.map((d) => {
    const next = new Date(d);
    next.setDate(next.getDate() + 1);
    return items.filter((h) => h.createdAt >= d.getTime() && h.createdAt < next.getTime()).length;
  });
  const max = Math.max(...perDay, 1);

  return (
    <div className="mx-auto max-w-6xl px-6 py-8">
      <PageHeader
        icon={<BarChart3 className="size-5" />}
        title="Analytics"
        description="Usage stats begin at zero and update from real activity only."
      />
      {items.length === 0 ? (
        <div className="glass grid place-items-center rounded-xl p-16 text-center text-sm text-muted-foreground">
          Start using Chambers OS to see analytics.
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          <div className="glass rounded-xl p-5">
            <div className="text-sm font-semibold">Last 7 days</div>
            <div className="mt-4 flex h-40 items-end justify-between gap-2">
              {perDay.map((v, i) => (
                <div key={i} className="flex flex-1 flex-col items-center gap-1">
                  <div
                    className="w-full rounded-t bg-primary/80 transition-all"
                    style={{ height: `${(v / max) * 100}%`, minHeight: v ? 4 : 0 }}
                    title={`${v} requests`}
                  />
                  <div className="text-[10px] text-muted-foreground">
                    {days[i].toLocaleDateString(undefined, { weekday: "short" })}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="glass rounded-xl p-5">
            <div className="text-sm font-semibold">By feature</div>
            <ul className="mt-4 space-y-3 text-sm">
              {Object.entries(byFeature).map(([k, v]) => (
                <li key={k}>
                  <div className="mb-1 flex justify-between text-xs">
                    <span className="capitalize text-muted-foreground">{k.replace("_", " ")}</span>
                    <span>{v}</span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-accent/50">
                    <div className="h-full bg-primary" style={{ width: `${(v / items.length) * 100}%` }} />
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
