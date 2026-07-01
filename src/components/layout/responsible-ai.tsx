import { AlertTriangle } from "lucide-react";

export function ResponsibleAI() {
  return (
    <div className="glass mt-6 flex items-start gap-3 rounded-xl p-3 text-xs text-muted-foreground">
      <AlertTriangle className="mt-0.5 size-4 shrink-0 text-primary" />
      <p>
        AI-generated legal content is intended to assist legal professionals and students.
        It should always be reviewed and verified before use in legal, academic, or professional settings.
      </p>
    </div>
  );
}
