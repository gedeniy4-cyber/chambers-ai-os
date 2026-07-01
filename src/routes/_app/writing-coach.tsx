import { createFileRoute } from "@tanstack/react-router";
import { useRef } from "react";
import { PageHeader } from "@/components/layout/page-header";
import { AiForm } from "@/components/ai/ai-form";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { GraduationCap } from "lucide-react";

export const Route = createFileRoute("/_app/writing-coach")({
  head: () => ({ meta: [{ title: "Legal Writing Coach — Chambers OS" }] }),
  component: Page,
});

function Page() {
  const t = useRef<HTMLTextAreaElement>(null);
  return (
    <div className="mx-auto max-w-6xl px-6 py-8">
      <PageHeader icon={<GraduationCap className="size-5" />} title="Legal Writing Coach" description="Rewrite for clarity, precision and plain language." />
      <AiForm feature="writing_coach" title="Writing coach" fields={() => ({ text: t.current?.value })}>
        <div className="space-y-1"><Label>Text to improve</Label><Textarea ref={t} rows={14} placeholder="Paste your paragraph, clause or letter…" /></div>
      </AiForm>
    </div>
  );
}
