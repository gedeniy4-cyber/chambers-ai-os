import { createFileRoute } from "@tanstack/react-router";
import { useRef } from "react";
import { PageHeader } from "@/components/layout/page-header";
import { AiForm } from "@/components/ai/ai-form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Target } from "lucide-react";

export const Route = createFileRoute("/_app/strategy")({
  head: () => ({ meta: [{ title: "Case Strategy — Chambers OS" }] }),
  component: Page,
});

function Page() {
  const matter = useRef<HTMLInputElement>(null);
  const obj = useRef<HTMLInputElement>(null);
  const facts = useRef<HTMLTextAreaElement>(null);
  const opp = useRef<HTMLTextAreaElement>(null);
  return (
    <div className="mx-auto max-w-6xl px-6 py-8">
      <PageHeader icon={<Target className="size-5" />} title="Case Strategy Assistant" description="Develop a strategy memo from facts and objectives." />
      <AiForm feature="strategy" title="Case strategy"
        fields={() => ({ matter: matter.current?.value, objective: obj.current?.value, facts: facts.current?.value, opposing: opp.current?.value })}>
        <div className="space-y-1"><Label>Matter</Label><Input ref={matter} /></div>
        <div className="space-y-1"><Label>Client objective</Label><Input ref={obj} /></div>
        <div className="space-y-1"><Label>Known facts</Label><Textarea ref={facts} rows={6} /></div>
        <div className="space-y-1"><Label>Opposing position (optional)</Label><Textarea ref={opp} rows={4} /></div>
      </AiForm>
    </div>
  );
}
