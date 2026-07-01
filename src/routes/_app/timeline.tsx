import { createFileRoute } from "@tanstack/react-router";
import { useRef } from "react";
import { PageHeader } from "@/components/layout/page-header";
import { AiForm } from "@/components/ai/ai-form";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Clock } from "lucide-react";

export const Route = createFileRoute("/_app/timeline")({
  head: () => ({ meta: [{ title: "Case Timeline — Chambers OS" }] }),
  component: Page,
});

function Page() {
  const m = useRef<HTMLTextAreaElement>(null);
  return (
    <div className="mx-auto max-w-6xl px-6 py-8">
      <PageHeader icon={<Clock className="size-5" />} title="Case Timeline Generator" description="Build a chronological timeline from mixed source material." />
      <AiForm feature="timeline" title="Case timeline" fields={() => ({ material: m.current?.value })}>
        <div className="space-y-1"><Label>Material (statements, letters, notes)</Label><Textarea ref={m} rows={14} /></div>
      </AiForm>
    </div>
  );
}
