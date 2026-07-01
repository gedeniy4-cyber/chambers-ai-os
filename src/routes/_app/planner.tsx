import { createFileRoute } from "@tanstack/react-router";
import { useRef } from "react";
import { PageHeader } from "@/components/layout/page-header";
import { AiForm } from "@/components/ai/ai-form";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ListChecks } from "lucide-react";

export const Route = createFileRoute("/_app/planner")({
  head: () => ({ meta: [{ title: "Task Planner — Chambers OS" }] }),
  component: Planner,
});

function Planner() {
  const tasks = useRef<HTMLTextAreaElement>(null);
  const hours = useRef<HTMLInputElement>(null);

  return (
    <div className="mx-auto max-w-6xl px-6 py-8">
      <PageHeader
        icon={<ListChecks className="size-5" />}
        title="AI Task Planner"
        description="Turn a list of matters and deadlines into a prioritised, time-boxed day."
      />
      <AiForm
        feature="planner"
        title="Daily plan"
        fields={() => ({
          tasks: tasks.current?.value ?? "",
          hours: hours.current?.value ?? "08:00 – 17:00",
        })}
      >
        <div className="space-y-1">
          <Label>Working hours</Label>
          <Input ref={hours} defaultValue="08:00 – 17:00" />
        </div>
        <div className="space-y-1">
          <Label>Tasks + deadlines (one per line)</Label>
          <Textarea
            ref={tasks}
            rows={10}
            placeholder={`Draft heads of argument — due Friday\nCall client re. settlement — today\nReview discovery bundle — Wed\nPrep for consultation — 14:00 today`}
          />
        </div>
      </AiForm>
    </div>
  );
}
