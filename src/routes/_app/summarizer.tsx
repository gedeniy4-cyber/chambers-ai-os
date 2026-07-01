import { createFileRoute } from "@tanstack/react-router";
import { useRef, useState } from "react";
import { PageHeader } from "@/components/layout/page-header";
import { AiForm } from "@/components/ai/ai-form";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { FileText, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export const Route = createFileRoute("/_app/summarizer")({
  head: () => ({ meta: [{ title: "Meeting Summarizer — Chambers OS" }] }),
  component: SummPage,
});

function SummPage() {
  const notesRef = useRef<HTMLTextAreaElement>(null);
  const [notes, setNotes] = useState("");

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (!f) return;
    if (f.size > 2_000_000) return toast.error("File too large (2MB max for guest upload).");
    if (!/(text|txt|md|json)/.test(f.type) && !/\.(txt|md)$/i.test(f.name)) {
      return toast.error("Only .txt / .md supported in guest mode. Paste PDF/DOCX content directly.");
    }
    const t = await f.text();
    setNotes(t);
    if (notesRef.current) notesRef.current.value = t;
  }

  return (
    <div className="mx-auto max-w-6xl px-6 py-8">
      <PageHeader
        icon={<FileText className="size-5" />}
        title="Meeting Summarizer"
        description="Paste transcripts, minutes or notes. Get an executive summary with decisions and deadlines."
      />
      <AiForm
        feature="summarizer"
        title="Meeting Summary"
        fields={() => ({ notes: notesRef.current?.value ?? "" })}
      >
        <div className="space-y-1">
          <div className="flex items-center justify-between">
            <Label>Notes / transcript</Label>
            <Button size="sm" variant="ghost" asChild>
              <label className="cursor-pointer">
                <Upload className="mr-1.5 size-3.5" /> Upload .txt
                <input type="file" accept=".txt,.md,text/plain" className="hidden" onChange={handleFile} />
              </label>
            </Button>
          </div>
          <Textarea ref={notesRef} defaultValue={notes} rows={14} placeholder="Paste your meeting notes here…" />
        </div>
      </AiForm>
    </div>
  );
}
