import { createFileRoute } from "@tanstack/react-router";
import { useRef } from "react";
import { PageHeader } from "@/components/layout/page-header";
import { AiForm } from "@/components/ai/ai-form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { ScrollText } from "lucide-react";

export const Route = createFileRoute("/_app/argument")({
  head: () => ({ meta: [{ title: "Argument Builder — Chambers OS" }] }),
  component: Page,
});

function Page() {
  const pos = useRef<HTMLInputElement>(null);
  const facts = useRef<HTMLTextAreaElement>(null);
  return (
    <div className="mx-auto max-w-6xl px-6 py-8">
      <PageHeader icon={<ScrollText className="size-5" />} title="Argument Builder" description="Construct a persuasive legal argument with rebuttals." />
      <AiForm feature="argument" title="Legal argument" fields={() => ({ position: pos.current?.value, facts: facts.current?.value })}>
        <div className="space-y-1"><Label>Position to argue</Label><Input ref={pos} /></div>
        <div className="space-y-1"><Label>Supporting facts</Label><Textarea ref={facts} rows={8} /></div>
      </AiForm>
    </div>
  );
}
