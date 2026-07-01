import { createFileRoute, Link } from "@tanstack/react-router";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import {
  Gavel, Sparkles, Mail, MessageSquare, FileText, ListChecks, Search,
  ShieldCheck, ArrowRight, Check, Play,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Accordion, AccordionContent, AccordionItem, AccordionTrigger,
} from "@/components/ui/accordion";
import { PLANS, formatZAR } from "@/lib/subscription";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Chambers OS — AI Operating System for Legal Professionals" },
      {
        name: "description",
        content:
          "Draft legal emails, summarise meetings, run research and plan matters with an AI workspace built for law students, attorneys, advocates and legal teams.",
      },
      { property: "og:title", content: "Chambers OS" },
      {
        property: "og:description",
        content: "The AI Operating System for Modern Legal Professionals.",
      },
    ],
  }),
  component: Landing,
});

const SPONSOR_LINES = ["By Yondela Gedeni", "Sponsored by CAPACITI"];

function SponsorTicker() {
  const [i, setI] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setI((v) => (v + 1) % SPONSOR_LINES.length), 3200);
    return () => clearInterval(t);
  }, []);
  return (
    <div className="relative h-6 overflow-hidden text-xs uppercase tracking-[0.35em] text-muted-foreground">
      <AnimatePresence mode="wait">
        <motion.span
          key={i}
          initial={{ y: 12, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -12, opacity: 0 }}
          transition={{ duration: 0.55, ease: "easeOut" }}
          className="absolute inset-0 flex items-center justify-center gap-2"
        >
          <span className="size-1 rounded-full bg-primary" />
          <span>{SPONSOR_LINES[i]}</span>
          <span className="size-1 rounded-full bg-primary" />
        </motion.span>
      </AnimatePresence>
    </div>
  );
}

const FEATURES = [
  { icon: Mail, title: "Legal Email Generator", body: "Draft precise correspondence in seconds — set recipient, matter, purpose and tone." },
  { icon: FileText, title: "Meeting Summarizer", body: "Turn transcripts into executive summaries, decisions, action items and deadlines." },
  { icon: Search, title: "Research Assistant", body: "Structured legal research with jurisdiction filters and authorities to verify." },
  { icon: ListChecks, title: "Task Planner", body: "Prioritised daily schedules built around your deadlines and working hours." },
  { icon: MessageSquare, title: "AI Legal Chat", body: "Persistent, streaming conversations with an assistant trained on legal workflows." },
  { icon: ShieldCheck, title: "Contract Review", body: "Redlines, red flags, missing provisions and risk ratings from any contract text." },
];

function Landing() {
  return (
    <div className="hero-radial min-h-screen">
      {/* Top nav */}
      <header className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
        <Link to="/" className="flex items-center gap-2">
          <div className="grid size-9 place-items-center rounded-lg bg-primary text-primary-foreground shadow-lg shadow-primary/20">
            <Gavel className="size-5" />
          </div>
          <div>
            <div className="text-sm font-semibold tracking-tight">Chambers OS</div>
            <div className="text-[10px] uppercase tracking-widest text-muted-foreground">
              Legal AI Workspace
            </div>
          </div>
        </Link>
        <nav className="hidden items-center gap-6 text-sm text-muted-foreground md:flex">
          <a href="#features" className="hover:text-foreground">Features</a>
          <a href="#pricing" className="hover:text-foreground">Pricing</a>
          <a href="#faq" className="hover:text-foreground">FAQ</a>
          <Link to="/auth" className="hover:text-foreground">Sign in</Link>
        </nav>
        <Link to="/dashboard">
          <Button className="bg-primary text-primary-foreground hover:opacity-90">
            Launch <ArrowRight className="ml-1.5 size-4" />
          </Button>
        </Link>
      </header>

      {/* Hero */}
      <section className="mx-auto max-w-7xl px-6 pb-16 pt-8 md:pt-16">
        <div className="mx-auto max-w-3xl text-center">
          <Badge variant="outline" className="border-primary/30 bg-primary/10 text-primary">
            <Sparkles className="mr-1 size-3" /> AI for legal professionals
          </Badge>
          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="mt-5 text-5xl font-extrabold tracking-tight md:text-7xl"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            <span className="gold-gradient-text">Chambers OS</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="mt-5 text-lg text-muted-foreground md:text-xl"
          >
            The AI Operating System for Modern Legal Professionals.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="mt-8 flex flex-wrap justify-center gap-3"
          >
            <Link to="/dashboard">
              <Button size="lg" className="bg-primary text-primary-foreground hover:opacity-90">
                Launch Workspace <ArrowRight className="ml-1.5 size-4" />
              </Button>
            </Link>
            <Dialog>
              <DialogTrigger asChild>
                <Button size="lg" variant="outline" className="border-primary/30">
                  <Play className="mr-1.5 size-4" /> Book Demo
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Book a Chambers OS demo</DialogTitle>
                </DialogHeader>
                <p className="text-sm text-muted-foreground">
                  Leave your details and we'll walk your firm through the platform.
                </p>
                <form
                  className="mt-4 space-y-3"
                  onSubmit={(e) => {
                    e.preventDefault();
                    (e.target as HTMLFormElement).reset();
                    import("sonner").then(({ toast }) => toast.success("Demo requested — we'll be in touch."));
                  }}
                >
                  <input required placeholder="Full name" className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm" />
                  <input required type="email" placeholder="Work email" className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm" />
                  <input placeholder="Firm / organisation" className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm" />
                  <Button type="submit" className="w-full bg-primary text-primary-foreground">Request demo</Button>
                </form>
              </DialogContent>
            </Dialog>
            <Link to="/dashboard">
              <Button size="lg" variant="ghost" className="text-muted-foreground">
                Try as guest — no sign-up
              </Button>
            </Link>
          </motion.div>

          <div className="mt-10">
            <SponsorTicker />
          </div>
        </div>

        {/* Animated dashboard preview */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.3 }}
          className="glass mx-auto mt-16 max-w-5xl overflow-hidden rounded-2xl border-primary/20 shadow-2xl shadow-primary/10"
        >
          <div className="flex items-center gap-2 border-b border-border/60 bg-black/20 px-4 py-2">
            <span className="size-2.5 rounded-full bg-red-400/60" />
            <span className="size-2.5 rounded-full bg-yellow-400/60" />
            <span className="size-2.5 rounded-full bg-green-400/60" />
            <div className="ml-4 text-xs text-muted-foreground">chambers.os / workspace</div>
          </div>
          <div className="grid gap-4 p-6 md:grid-cols-3">
            {[
              { label: "AI Requests", value: "Unlimited", tag: "Guest mode" },
              { label: "Emails Drafted", value: "12", tag: "Today" },
              { label: "Active Matter", value: "Smith v. Ndlovu", tag: "In progress" },
            ].map((c, i) => (
              <motion.div
                key={c.label}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 + i * 0.15 }}
                className="rounded-xl border border-border bg-card/80 p-4"
              >
                <div className="text-xs uppercase tracking-widest text-muted-foreground">{c.label}</div>
                <div className="mt-2 text-2xl font-semibold">{c.value}</div>
                <div className="mt-1 text-xs text-primary">{c.tag}</div>
              </motion.div>
            ))}
          </div>
          <div className="grid gap-4 border-t border-border/60 p-6 md:grid-cols-2">
            <div className="rounded-xl border border-border bg-card/60 p-4">
              <div className="text-xs uppercase tracking-widest text-muted-foreground">Draft — Opinion letter</div>
              <div className="mt-3 space-y-2 text-sm">
                {["The plaintiff's claim under section 12(1)…", "In Ferreira v Levin the court held…", "It follows that…"].map((s, i) => (
                  <motion.div key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.9 + i * 0.4 }}>
                    {s}
                  </motion.div>
                ))}
              </div>
            </div>
            <div className="rounded-xl border border-border bg-card/60 p-4">
              <div className="text-xs uppercase tracking-widest text-muted-foreground">Today's Plan</div>
              <ul className="mt-3 space-y-2 text-sm">
                <li className="flex items-center gap-2"><Check className="size-4 text-primary" /> Review Ndlovu bundle</li>
                <li className="flex items-center gap-2"><Check className="size-4 text-primary" /> Call opposing counsel</li>
                <li className="flex items-center gap-2 text-muted-foreground"><span className="size-2 rounded-full border border-border" /> Draft Rule 35(3) notice</li>
              </ul>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Features */}
      <section id="features" className="mx-auto max-w-7xl px-6 py-20">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight md:text-4xl">Everything a chamber needs</h2>
          <p className="mt-3 text-muted-foreground">
            Reusable AI tools across drafting, research, planning and client communication.
          </p>
        </div>
        <div className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.05 }}
              className="glass rounded-xl p-6 transition hover:border-primary/40"
            >
              <div className="grid size-10 place-items-center rounded-lg bg-primary/15 text-primary">
                <f.icon className="size-5" />
              </div>
              <h3 className="mt-4 font-semibold">{f.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{f.body}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section className="mx-auto max-w-7xl px-6 py-16">
        <div className="grid gap-4 md:grid-cols-3">
          {[
            { q: "Cut my drafting time in half. The tone controls are excellent.", by: "N. Mokoena, Attorney" },
            { q: "Perfect for our candidate attorneys — structured research every time.", by: "Senior Partner, JHB firm" },
            { q: "Best exam-prep tool I've used in law school.", by: "T. Dlamini, LLB student" },
          ].map((t) => (
            <div key={t.by} className="glass rounded-xl p-6">
              <p className="text-sm">"{t.q}"</p>
              <p className="mt-4 text-xs uppercase tracking-widest text-primary">{t.by}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="mx-auto max-w-7xl px-6 py-20">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight md:text-4xl">Simple, ZAR pricing</h2>
          <p className="mt-3 text-muted-foreground">
            Guest access is unlimited and fully functional. Sign in and pick a plan to sync across devices.
          </p>
        </div>
        <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {PLANS.slice(0, 3).map((p) => (
            <div key={p.id} className="glass rounded-xl p-6">
              <div className="text-sm font-semibold text-primary">{p.name}</div>
              <div className="mt-3 text-3xl font-bold">
                {formatZAR(p.priceZAR)}
                <span className="ml-1 text-xs font-normal text-muted-foreground">/mo</span>
              </div>
              <p className="mt-1 text-sm text-muted-foreground">{p.tagline}</p>
              <ul className="mt-5 space-y-2 text-sm">
                {p.features.map((f) => (
                  <li key={f} className="flex items-start gap-2">
                    <Check className="mt-0.5 size-4 shrink-0 text-primary" /> {f}
                  </li>
                ))}
              </ul>
              <Link to="/pricing" className="mt-6 block">
                <Button variant={p.id === "pro" ? "default" : "outline"} className="w-full">
                  {p.cta ?? "Choose"}
                </Button>
              </Link>
            </div>
          ))}
        </div>
        <div className="mt-4 text-center text-xs text-muted-foreground">
          Premium Family (R1 499/mo) and Business (from R4 999/mo) — see{" "}
          <Link to="/pricing" className="text-primary hover:underline">all plans</Link>.
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="mx-auto max-w-3xl px-6 py-16">
        <h2 className="text-center text-3xl font-bold tracking-tight md:text-4xl">FAQ</h2>
        <Accordion type="single" collapsible className="mt-8">
          {[
            { q: "Is my data private?", a: "Yes. Guest data stays in your browser. Signed-in data is scoped to your account with row-level security." },
            { q: "Can I use it without signing up?", a: "Absolutely — guest mode has every feature, with no limits or paywalls." },
            { q: "Which AI model powers it?", a: "Chambers OS runs on a provider-agnostic gateway. We can switch models without touching the app." },
            { q: "Do you support Microsoft SSO?", a: "Coming soon. Today we support email/password and Google sign-in." },
            { q: "Is payment real?", a: "Not yet — the subscription flow is simulated for demonstration." },
          ].map((f) => (
            <AccordionItem key={f.q} value={f.q}>
              <AccordionTrigger>{f.q}</AccordionTrigger>
              <AccordionContent>{f.a}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </section>

      {/* Footer */}
      <footer className="border-t border-border">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-6 py-8 text-xs text-muted-foreground md:flex-row">
          <div>© {new Date().getFullYear()} Chambers OS. All rights reserved.</div>
          <div className="flex items-center gap-4">
            <Link to="/pricing" className="hover:text-foreground">Pricing</Link>
            <Link to="/auth" className="hover:text-foreground">Sign in</Link>
            <Link to="/dashboard" className="hover:text-foreground">Workspace</Link>
          </div>
          <div><SponsorTicker /></div>
        </div>
      </footer>
    </div>
  );
}
