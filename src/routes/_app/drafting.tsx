import { createFileRoute } from "@tanstack/react-router";
import { useRef } from "react";
import { PageHeader } from "@/components/layout/page-header";
import { AiForm } from "@/components/ai/ai-form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { FilePen } from "lucide-react";

export const Route = createFileRoute("/_app/drafting")({
  head: () => ({ meta: [{ title: "Legal Drafting — Chambers OS" }] }),
  component: Page,
});

function Page() {
  const docType = useRef<HTMLInputElement>(null);
  const parties = useRef<HTMLInputElement>(null);
  const gov = useRef<HTMLInputElement>(null);
  const instr = useRef<HTMLTextAreaElement>(null);
  return (
    <div className="mx-auto max-w-6xl px-6 py-8">
      <PageHeader icon={<FilePen className="size-5" />} title="Advanced Legal Drafting" description="Draft contracts, opinions and pleadings from structured inputs." />
      <AiForm feature="drafting" title="Legal draft"
        fields={() => ({ docType: docType.current?.value, parties: parties.current?.value, governingLaw: gov.current?.value, instructions: instr.current?.value })}>
        <div className="space-y-1"><Label>Document type</Label><Input ref={docType} placeholder="e.g. Sale of shares agreement" /></div>
        <div className="space-y-1"><Label>Parties</Label><Input ref={parties} placeholder="e.g. Seller Pty Ltd and Buyer Pty Ltd" /></div>
        <div className="space-y-1"><Label>Governing law</Label><Input ref={gov} defaultValue="South Africa" /></div>
        <div className="space-y-1"><Label>Key terms / instructions</Label><Textarea ref={instr} rows={6} placeholder="Purchase price, warranties, conditions precedent…" /></div>
      </AiForm>
    </div>
  );
}
