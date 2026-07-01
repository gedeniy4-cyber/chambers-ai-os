import { createFileRoute, Link } from "@tanstack/react-router";
import { useAuth } from "@/lib/auth-context";
import { getHistory, getTier } from "@/lib/guest-store";
import { useEffect, useState } from "react";
import { PageHeader } from "@/components/layout/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  LayoutDashboard, Mail, FileText, ListChecks, Search, MessageSquare,
  Sparkles, Infinity as InfIcon, Clock,
} from "lucide-react";
import { motion } from "framer-motion";

export const Route = createFileRoute("/_app/dashboard")({
  head: () => ({ meta: [{ title: "Dashboard — Chambers OS" }] }),
  component: Dashboard,
});

const QUICK = [
  { to: "/email", icon: Mail, label: "Draft Email", color: "text-blue-300" },
  { to: "/summarizer", icon: FileText, label: "Summarize", color: "text-emerald-300" },
  { to: "/research", icon: Search, label: "Research", color: "text-violet-300" },
  { to: "/planner", icon: ListChecks, label: "Plan Day", color: "text-amber-300" },
  { to: "/chat", icon: MessageSquare, label: "Ask AI", color: "text-primary" },
];

function Dashboard() {
  const { isGuest, isCreator, user } = useAuth();
  const [history, setHistory] = useState(() => (typeof window !== "undefined" ? getHistory() : []));
  const tier = typeof window !== "undefined" ? getTier() : "basic";

  useEffect(() => {
    const refresh = () => setHistory(getHistory());
    refresh();
    window.addEventListener("chambers:history-changed", refresh);
    return () => window.removeEventListener("chambers:history-changed", refresh);
  }, []);

  const counts = {
    email: history.filter((h) => h.feature === "email").length,
    summarizer: history.filter((h) => h.feature === "summarizer").length,
    research: history.filter((h) => h.feature === "research").length,
    chat: 0, // chat lives in its own store
    planner: history.filter((h) => h.feature === "planner").length,
  };
  const total = history.length;

  return (
    <div className="mx-auto max-w-6xl px-6 py-8">
      <PageHeader
        icon={<LayoutDashboard className="size-5" />}
        title={isGuest ? "Welcome, Guest" : `Welcome${user?.email ? `, ${user.email.split("@")[0]}` : ""}`}
        description={
          isGuest
            ? "Guest mode is unlimited and fully functional. Sign in any time to sync across devices."
            : isCreator
              ? "Creator mode — every plan and tool is unlocked."
              : `Plan: ${tier.replace("_", " ")}.`
        }
      />

      {/* Usage stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <StatCard label="AI Requests" value={isGuest || isCreator ? <span className="flex items-center gap-1"><InfIcon className="size-5" /> Unlimited</span> : `${total}`} />
        <StatCard label="Emails Generated" value={counts.email} />
        <StatCard label="Meetings Summarized" value={counts.summarizer} />
        <StatCard label="Research Sessions" value={counts.research} />
      </div>

      {/* Quick actions */}
      <div className="mt-8">
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-widest text-muted-foreground">
          Quick actions
        </h2>
        <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-5">
          {QUICK.map((q, i) => (
            <motion.div
              key={q.to}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
            >
              <Link
                to={q.to}
                className="glass group flex items-center gap-3 rounded-xl p-4 transition hover:border-primary/40"
              >
                <q.icon className={`size-5 ${q.color}`} />
                <span className="text-sm font-medium">{q.label}</span>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Recent activity */}
      <div className="mt-8 grid gap-4 lg:grid-cols-2">
        <Card className="glass">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Clock className="size-4 text-primary" /> Recent activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            {history.length === 0 ? (
              <div className="grid place-items-center py-10 text-center text-sm text-muted-foreground">
                <Sparkles className="mb-2 size-6 text-primary/60" />
                No activity yet. Generate your first output to see it here.
              </div>
            ) : (
              <ul className="divide-y divide-border/60">
                {history.slice(0, 6).map((h) => (
                  <li key={h.id} className="flex items-start justify-between gap-3 py-2 text-sm">
                    <div className="min-w-0">
                      <div className="truncate font-medium">{h.title}</div>
                      <div className="text-xs text-muted-foreground">
                        {new Date(h.createdAt).toLocaleString()} · {h.feature}
                      </div>
                    </div>
                    <Link to="/history" className="text-xs text-primary hover:underline">
                      View
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>

        <Card className="glass">
          <CardHeader>
            <CardTitle className="text-base">Weekly analytics</CardTitle>
          </CardHeader>
          <CardContent>
            {total === 0 ? (
              <div className="grid place-items-center py-10 text-center text-sm text-muted-foreground">
                Start using Chambers OS to see analytics.
              </div>
            ) : (
              <div className="space-y-3 text-sm">
                {Object.entries(counts).map(([k, v]) => (
                  <div key={k}>
                    <div className="mb-1 flex justify-between text-xs">
                      <span className="capitalize text-muted-foreground">{k}</span>
                      <span>{v}</span>
                    </div>
                    <div className="h-2 overflow-hidden rounded-full bg-accent/50">
                      <div
                        className="h-full bg-primary"
                        style={{ width: `${Math.min(100, v * 12)}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="glass rounded-xl p-4">
      <div className="text-xs uppercase tracking-widest text-muted-foreground">{label}</div>
      <div className="mt-2 text-2xl font-semibold">{value}</div>
    </div>
  );
}
