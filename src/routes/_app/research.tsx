import { createFileRoute } from "@tanstack/react-router";
import { useRef } from "react";
import { PageHeader } from "@/components/layout/page-header";
import { AiForm } from "@/components/ai/ai-form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Search } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export const Route = createFileRoute("/_app/research")({
  head: () => ({ meta: [{ title: "Research Assistant — Chambers OS" }] }),
  component: Research,
});

function Research() {
  const q = useRef<HTMLInputElement>(null);
  const obj = useRef<HTMLInputElement>(null);
  const ctx = useRef<HTMLTextAreaElement>(null);
  const juris = useRef<string>("South Africa");

  return (
    <div className="mx-auto max-w-6xl px-6 py-8">
      <PageHeader
        icon={<Search className="size-5" />}
        title="Legal Research Assistant"
        description="Get a structured brief with authorities to verify and recommendations."
      />
      <AiForm
        feature="research"
        title="Research brief"
        fields={() => ({
          question: q.current?.value ?? "",
          objective: obj.current?.value ?? "",
          context: ctx.current?.value ?? "",
          jurisdiction: juris.current,
        })}
      >
        <div className="space-y-1">
          <Label>Research question</Label>
          <Input ref={q} placeholder="e.g. Requirements for spoliation under South African law" />
        </div>
        <div className="space-y-1">
          <Label>Objective</Label>
          <Input ref={obj} placeholder="e.g. Advise client on likelihood of urgent application succeeding" />
        </div>
        <div className="space-y-1">
          <Label>Jurisdiction</Label>
          <Select defaultValue="South Africa" onValueChange={(v) => (juris.current = v)}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              {["South Africa", "Namibia", "Botswana", "United Kingdom", "United States", "Australia", "Kenya", "Zambia", "General common law"].map(j => (
                <SelectItem key={j} value={j}>{j}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1">
          <Label>Supporting material (optional)</Label>
          <Textarea ref={ctx} rows={5} placeholder="Paste facts, prior authorities, or extracts here…" />
        </div>
      </AiForm>
    </div>
  );
}
