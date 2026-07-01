import { createFileRoute, Link } from "@tanstack/react-router";
import { PLANS, formatZAR } from "@/lib/subscription";
import { setTier, getTier } from "@/lib/guest-store";
import { useAuth } from "@/lib/auth-context";
import { Button } from "@/components/ui/button";
import { Check, Gavel } from "lucide-react";
import { toast } from "sonner";
import { useState } from "react";

export const Route = createFileRoute("/pricing")({
  head: () => ({ meta: [{ title: "Pricing — Chambers OS" }] }),
  component: Pricing,
});

function Pricing() {
  const { isGuest, isCreator } = useAuth();
  const [current, setCurrent] = useState(getTier());

  function activate(id: (typeof PLANS)[number]["id"]) {
    if (isGuest) {
      toast.info("Guest mode already unlocks everything. Sign in to save a plan.");
      return;
    }
    setTier(id);
    setCurrent(id);
    toast.success(`Activated ${id.replace("_", " ")} plan — features updated.`);
  }

  return (
    <div className="hero-radial min-h-screen px-6 py-10">
      <div className="mx-auto max-w-6xl">
        <Link to="/" className="mb-6 inline-flex items-center gap-2">
          <div className="grid size-9 place-items-center rounded-lg bg-primary text-primary-foreground">
            <Gavel className="size-5" />
          </div>
          <span className="font-semibold">Chambers OS</span>
        </Link>

        <div className="mx-auto max-w-2xl text-center">
          <h1 className="text-3xl font-bold md:text-5xl">Choose your plan</h1>
          <p className="mt-3 text-muted-foreground">
            Priced in South African Rand (ZAR). Payment flow is simulated — no card required.
            {isCreator && " Creator mode: everything is already unlocked."}
          </p>
        </div>

        <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {PLANS.map((p) => {
            const active = current === p.id;
            return (
              <div
                key={p.id}
                className={`glass flex flex-col rounded-xl p-6 ${active ? "border-primary/50 shadow-lg shadow-primary/10" : ""}`}
              >
                <div className="text-sm font-semibold text-primary">{p.name}</div>
                <div className="mt-3 text-3xl font-bold">
                  {formatZAR(p.priceZAR)}
                  <span className="ml-1 text-xs font-normal text-muted-foreground">/{p.billing.includes("month") ? "mo" : "once"}</span>
                </div>
                <p className="mt-1 text-sm text-muted-foreground">{p.tagline}</p>
                <ul className="mt-5 flex-1 space-y-2 text-sm">
                  {p.features.map((f) => (
                    <li key={f} className="flex items-start gap-2">
                      <Check className="mt-0.5 size-4 shrink-0 text-primary" /> {f}
                    </li>
                  ))}
                </ul>
                <Button
                  onClick={() => activate(p.id)}
                  className="mt-6 w-full"
                  variant={active ? "default" : p.id === "premium_single" ? "default" : "outline"}
                  disabled={active}
                >
                  {active ? "Current plan" : p.cta ?? "Activate"}
                </Button>
              </div>
            );
          })}
        </div>

        <p className="mt-10 text-center text-xs text-muted-foreground">
          Guest mode is unlimited — plans exist for team seats and cross-device sync.
        </p>
      </div>
    </div>
  );
}
