import { createFileRoute, Link } from "@tanstack/react-router";
import { PageHeader } from "@/components/layout/page-header";
import { Sparkles, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export const Route = createFileRoute("/_app/prompts")({
  head: () => ({ meta: [{ title: "Prompt Library — Chambers OS" }] }),
  component: Prompts,
});

const CATEGORIES: { name: string; items: { title: string; prompt: string; to: string }[] }[] = [
  {
    name: "Contract Drafting",
    items: [
      { title: "NDA — mutual", prompt: "Draft a mutual NDA between {Party A} and {Party B}. Governing law: {Jurisdiction}. Include definition of Confidential Information, exclusions, term of 3 years, and standard boilerplate.", to: "/drafting" },
      { title: "Service Agreement", prompt: "Draft a professional services agreement for {scope}. Include payment terms, IP ownership, warranties, indemnity and termination clauses.", to: "/drafting" },
    ],
  },
  {
    name: "Legal Opinion",
    items: [
      { title: "Enforceability of restraint of trade", prompt: "Prepare a legal opinion on the enforceability of the following restraint of trade clause under South African law: {clause}.", to: "/research" },
    ],
  },
  {
    name: "Case Summary",
    items: [
      { title: "Structured case note", prompt: "Provide a structured case note for {citation}: Facts, Issues, Ratio, Held, Significance.", to: "/research" },
    ],
  },
  {
    name: "Client Emails",
    items: [
      { title: "Fee update to client", prompt: "Draft a friendly, transparent email updating {client} on billed fees and next steps in matter {matter}.", to: "/email" },
    ],
  },
  {
    name: "Court Preparation",
    items: [
      { title: "Motion court appearance", prompt: "Prepare notes for a motion court appearance in {matter}. Include likely questions from the bench.", to: "/court-prep" },
    ],
  },
  {
    name: "Exam Preparation",
    items: [
      { title: "LLB exam study plan", prompt: "Build a 2-week study plan covering {module}. Include daily topics, active-recall questions, and a self-test on day 14.", to: "/planner" },
    ],
  },
];

export default function _noop(){/* keep default export unused */}

function Prompts() {
  return (
    <div className="mx-auto max-w-5xl px-6 py-8">
      <PageHeader
        icon={<Sparkles className="size-5" />}
        title="Prompt Library"
        description="Ready-made prompts to plug into any AI feature."
      />
      <div className="space-y-6">
        {CATEGORIES.map((c) => (
          <div key={c.name}>
            <div className="mb-2 text-sm font-semibold uppercase tracking-widest text-muted-foreground">
              {c.name}
            </div>
            <div className="grid gap-3 md:grid-cols-2">
              {c.items.map((p) => (
                <div key={p.title} className="glass rounded-xl p-4">
                  <div className="text-sm font-semibold">{p.title}</div>
                  <p className="mt-1 text-xs text-muted-foreground">{p.prompt}</p>
                  <div className="mt-3 flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        navigator.clipboard.writeText(p.prompt);
                        toast.success("Prompt copied");
                      }}
                    >
                      <Copy className="mr-1.5 size-3.5" /> Copy
                    </Button>
                    <Link to={p.to}>
                      <Button size="sm">Open →</Button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
