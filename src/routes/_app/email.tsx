import { createFileRoute } from "@tanstack/react-router";
import { useRef } from "react";
import { PageHeader } from "@/components/layout/page-header";
import { AiForm } from "@/components/ai/ai-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Mail } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export const Route = createFileRoute("/_app/email")({
  head: () => ({ meta: [{ title: "Legal Email Generator — Chambers OS" }] }),
  component: EmailPage,
});

function EmailPage() {
  const recipient = useRef<HTMLInputElement>(null);
  const matter = useRef<HTMLInputElement>(null);
  const purpose = useRef<HTMLTextAreaElement>(null);
  const context = useRef<HTMLTextAreaElement>(null);
  const toneRef = useRef<string>("Formal");

  return (
    <div className="mx-auto max-w-6xl px-6 py-8">
      <PageHeader
        icon={<Mail className="size-5" />}
        title="Legal Email Generator"
        description="Draft precise correspondence with the right tone in seconds."
      />
      <AiForm
        feature="email"
        title="Legal Email"
        buildTitle={(i) => `Email to ${i.recipient || "recipient"} — ${i.matter || "matter"}`}
        fields={() => ({
          recipient: recipient.current?.value ?? "",
          matter: matter.current?.value ?? "",
          purpose: purpose.current?.value ?? "",
          tone: toneRef.current,
          context: context.current?.value ?? "",
        })}
      >
        <div className="space-y-1">
          <Label>Recipient</Label>
          <Input ref={recipient} placeholder="e.g. Opposing counsel, Mr. K. Naidoo" />
        </div>
        <div className="space-y-1">
          <Label>Matter</Label>
          <Input ref={matter} placeholder="e.g. Smith v. Ndlovu — case no. 2024/12345" />
        </div>
        <div className="space-y-1">
          <Label>Purpose</Label>
          <Textarea ref={purpose} rows={3} placeholder="e.g. Request extension for filing heads of argument" />
        </div>
        <div className="space-y-1">
          <Label>Tone</Label>
          <Select defaultValue="Formal" onValueChange={(v) => (toneRef.current = v)}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="Formal">Formal</SelectItem>
              <SelectItem value="Firm but respectful">Firm but respectful</SelectItem>
              <SelectItem value="Friendly">Friendly</SelectItem>
              <SelectItem value="Neutral">Neutral</SelectItem>
              <SelectItem value="Urgent">Urgent</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1">
          <Label>Additional context (optional)</Label>
          <Textarea ref={context} rows={3} placeholder="Paste prior email, notes, or attachment summary" />
        </div>
      </AiForm>
    </div>
  );
}
