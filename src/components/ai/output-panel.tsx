import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Copy, Download, RefreshCw, Save, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { Textarea } from "@/components/ui/textarea";

export function OutputPanel({
  text,
  onRegenerate,
  loading,
  onChange,
  filename = "chambers-output",
}: {
  text: string;
  onRegenerate?: () => void;
  loading?: boolean;
  onChange?: (v: string) => void;
  filename?: string;
}) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    toast.success("Copied to clipboard");
    setTimeout(() => setCopied(false), 1500);
  };
  const download = (ext: "txt" | "md") => {
    const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${filename}.${ext}`;
    a.click();
    URL.revokeObjectURL(url);
  };
  const printOut = () => {
    const w = window.open("", "_blank");
    if (!w) return;
    w.document.write(`<pre style="font-family:Inter,sans-serif;white-space:pre-wrap;padding:24px">${text.replace(/</g, "&lt;")}</pre>`);
    w.document.close();
    w.print();
  };

  return (
    <div className="glass rounded-xl">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border/60 px-4 py-2">
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Sparkles className="size-3.5 text-primary" /> AI Output — editable
        </div>
        <div className="flex flex-wrap gap-1.5">
          <Button size="sm" variant="ghost" onClick={copy}>
            <Copy className="mr-1.5 size-3.5" /> {copied ? "Copied" : "Copy"}
          </Button>
          <Button size="sm" variant="ghost" onClick={() => download("txt")}>
            <Download className="mr-1.5 size-3.5" /> .txt
          </Button>
          <Button size="sm" variant="ghost" onClick={() => download("md")}>
            <Download className="mr-1.5 size-3.5" /> .md
          </Button>
          <Button size="sm" variant="ghost" onClick={printOut}>
            <Save className="mr-1.5 size-3.5" /> Print / PDF
          </Button>
          {onRegenerate && (
            <Button size="sm" variant="outline" onClick={onRegenerate} disabled={loading}>
              <RefreshCw className={`mr-1.5 size-3.5 ${loading ? "animate-spin" : ""}`} /> Regenerate
            </Button>
          )}
        </div>
      </div>
      <Textarea
        value={text}
        onChange={(e) => onChange?.(e.target.value)}
        readOnly={!onChange}
        rows={18}
        className="min-h-[420px] resize-y whitespace-pre-wrap border-0 bg-transparent font-[Inter] text-sm leading-relaxed focus-visible:ring-0"
      />
    </div>
  );
}
