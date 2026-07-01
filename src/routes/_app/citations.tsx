import { createFileRoute } from "@tanstack/react-router";
import { useRef } from "react";
import { PageHeader } from "@/components/layout/page-header";
import { AiForm } from "@/components/ai/ai-form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Quote } from "lucide-react";

export const Route = createFileRoute("/_app/citations")({
  head: () => ({ meta: [{ title: "Citation Generator — Chambers OS" }] }),
  component: Page,
});

function Page() {
  const style = useRef<HTMLInputElement>(null);
  const refs = useRef<HTMLTextAreaElement>(null);
  return (
    <div className="mx-auto max-w-6xl px-6 py-8">
      <PageHeader icon={<Quote className="size-5" />} title="Citation Generator" description="Format raw references into a clean citation list." />
      <AiForm feature="citations" title="Citations" fields={() => ({ style: style.current?.value, references: refs.current?.value })}>
        <div className="space-y-1"><Label>Style</Label><Input ref={style} defaultValue="SA neutral citation" /></div>
        <div className="space-y-1"><Label>References (one per line)</Label><Textarea ref={refs} rows={10} placeholder="Ferreira v Levin, 1996\nCarmichele v Minister of Safety, 2001…" /></div>
      </AiForm>
    </div>
  );
}
