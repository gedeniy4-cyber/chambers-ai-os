import { createFileRoute } from "@tanstack/react-router";
import { useRef } from "react";
import { PageHeader } from "@/components/layout/page-header";
import { AiForm } from "@/components/ai/ai-form";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { ShieldCheck } from "lucide-react";

export const Route = createFileRoute("/_app/contract")({
  head: () => ({ meta: [{ title: "Contract Review — Chambers OS" }] }),
  component: Page,
});

function Page() {
  const c = useRef<HTMLTextAreaElement>(null);
  return (
    <div className="mx-auto max-w-6xl px-6 py-8">
      <PageHeader icon={<ShieldCheck className="size-5" />} title="Contract Review" description="Paste a contract to get red flags, redlines and risk rating." />
      <AiForm feature="contract" title="Contract review" fields={() => ({ contract: c.current?.value })}>
        <div className="space-y-1"><Label>Contract text</Label><Textarea ref={c} rows={16} placeholder="Paste the full contract text here…" /></div>
      </AiForm>
    </div>
  );
}
