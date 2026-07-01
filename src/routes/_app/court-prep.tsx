import { createFileRoute } from "@tanstack/react-router";
import { useRef } from "react";
import { PageHeader } from "@/components/layout/page-header";
import { AiForm } from "@/components/ai/ai-form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Gavel } from "lucide-react";

export const Route = createFileRoute("/_app/court-prep")({
  head: () => ({ meta: [{ title: "Court Preparation — Chambers OS" }] }),
  component: Page,
});

function Page() {
  const matter = useRef<HTMLInputElement>(null);
  const court = useRef<HTMLInputElement>(null);
  const obj = useRef<HTMLInputElement>(null);
  const ctx = useRef<HTMLTextAreaElement>(null);
  return (
    <div className="mx-auto max-w-6xl px-6 py-8">
      <PageHeader icon={<Gavel className="size-5" />} title="Court Preparation Assistant" description="Draft opening, key points and anticipated questions." />
      <AiForm feature="court_prep" title="Court prep"
        fields={() => ({ matter: matter.current?.value, court: court.current?.value, objective: obj.current?.value, context: ctx.current?.value })}>
        <div className="space-y-1"><Label>Matter</Label><Input ref={matter} /></div>
        <div className="space-y-1"><Label>Court / hearing type</Label><Input ref={court} placeholder="e.g. High Court, motion court" /></div>
        <div className="space-y-1"><Label>Objective</Label><Input ref={obj} /></div>
        <div className="space-y-1"><Label>Facts / documents</Label><Textarea ref={ctx} rows={8} /></div>
      </AiForm>
    </div>
  );
}
