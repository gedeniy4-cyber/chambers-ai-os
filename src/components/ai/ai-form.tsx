import { useState, type ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { Loader2, Wand2 } from "lucide-react";
import { useServerFn } from "@tanstack/react-start";
import { generate } from "@/lib/ai.functions";
import { toast } from "sonner";
import { addHistory } from "@/lib/guest-store";
import { OutputPanel } from "./output-panel";
import { ResponsibleAI } from "@/components/layout/responsible-ai";

export function AiForm({
  feature,
  title,
  fields,
  buildTitle,
  children,
}: {
  feature: string;
  title: string;
  fields: () => Record<string, unknown>;
  buildTitle?: (i: Record<string, unknown>) => string;
  children: ReactNode;
}) {
  const generateFn = useServerFn(generate);
  const [loading, setLoading] = useState(false);
  const [output, setOutput] = useState("");
  const [lastInput, setLastInput] = useState<Record<string, unknown> | null>(null);

  async function run(input?: Record<string, unknown>) {
    const values = input ?? fields();
    setLastInput(values);
    setLoading(true);
    setOutput("");
    try {
      const res = await generateFn({ data: { feature, input: values } });
      setOutput(res.text);
      addHistory({
        feature,
        title: buildTitle?.(values) ?? title,
        prompt: values,
        output: res.text,
      });
      toast.success("Generated");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <div className="glass rounded-xl p-5">
        <div className="mb-4 flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
          <Wand2 className="size-3.5 text-primary" /> Input
        </div>
        <div className="space-y-4">{children}</div>
        <Button
          onClick={() => run()}
          disabled={loading}
          className="mt-6 w-full bg-primary text-primary-foreground hover:opacity-90"
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 size-4 animate-spin" /> Generating…
            </>
          ) : (
            <>
              <Wand2 className="mr-2 size-4" /> Generate
            </>
          )}
        </Button>
        <ResponsibleAI />
      </div>

      <div>
        {loading && !output ? (
          <div className="glass grid min-h-[420px] place-items-center rounded-xl">
            <div className="flex flex-col items-center gap-3 text-muted-foreground">
              <Loader2 className="size-6 animate-spin text-primary" />
              <div className="text-sm">Drafting with Chambers AI…</div>
            </div>
          </div>
        ) : output ? (
          <OutputPanel
            text={output}
            onChange={setOutput}
            onRegenerate={() => lastInput && run(lastInput)}
            loading={loading}
            filename={`chambers-${feature}`}
          />
        ) : (
          <div className="glass grid min-h-[420px] place-items-center rounded-xl p-6 text-center text-sm text-muted-foreground">
            <div>
              <Wand2 className="mx-auto mb-3 size-6 text-primary/60" />
              Fill in the details and click <span className="text-foreground">Generate</span> to draft your output.
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
