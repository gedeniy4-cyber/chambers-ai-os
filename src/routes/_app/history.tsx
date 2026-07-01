import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { PageHeader } from "@/components/layout/page-header";
import { History, Star, Trash2, Search as SearchIcon } from "lucide-react";
import { getHistory, deleteHistory, toggleFavorite, type HistoryItem, clearHistory } from "@/lib/guest-store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { OutputPanel } from "@/components/ai/output-panel";

export const Route = createFileRoute("/_app/history")({
  head: () => ({ meta: [{ title: "History — Chambers OS" }] }),
  component: HistoryPage,
});

function HistoryPage() {
  const [items, setItems] = useState<HistoryItem[]>([]);
  const [q, setQ] = useState("");
  const [selected, setSelected] = useState<HistoryItem | null>(null);

  useEffect(() => {
    const refresh = () => setItems(getHistory());
    refresh();
    window.addEventListener("chambers:history-changed", refresh);
    return () => window.removeEventListener("chambers:history-changed", refresh);
  }, []);

  const filtered = items.filter(
    (h) =>
      !q ||
      h.title.toLowerCase().includes(q.toLowerCase()) ||
      h.output.toLowerCase().includes(q.toLowerCase()) ||
      h.feature.toLowerCase().includes(q.toLowerCase()),
  );

  return (
    <div className="mx-auto max-w-6xl px-6 py-8">
      <PageHeader
        icon={<History className="size-5" />}
        title="History"
        description="Every generation is saved locally in guest mode."
        actions={
          items.length ? (
            <Button variant="outline" size="sm" onClick={() => { clearHistory(); setSelected(null); }}>
              <Trash2 className="mr-1.5 size-3.5" /> Clear all
            </Button>
          ) : null
        }
      />

      {items.length === 0 ? (
        <div className="glass grid place-items-center rounded-xl p-16 text-center text-sm text-muted-foreground">
          No history available. Your generations will appear here.
        </div>
      ) : (
        <div className="grid gap-4 lg:grid-cols-[360px_1fr]">
          <div className="glass rounded-xl p-3">
            <div className="mb-3 flex items-center gap-2">
              <SearchIcon className="size-4 text-muted-foreground" />
              <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search history…" />
            </div>
            <ul className="max-h-[70vh] space-y-1 overflow-y-auto pr-1">
              {filtered.map((h) => (
                <li
                  key={h.id}
                  className={`flex items-start gap-2 rounded-lg p-2 text-sm transition ${
                    selected?.id === h.id ? "bg-accent" : "hover:bg-accent/60"
                  }`}
                >
                  <button className="min-w-0 flex-1 text-left" onClick={() => setSelected(h)}>
                    <div className="truncate font-medium">{h.title}</div>
                    <div className="text-xs text-muted-foreground">
                      {new Date(h.createdAt).toLocaleString()} · {h.feature}
                    </div>
                  </button>
                  <button
                    aria-label="Favorite"
                    onClick={() => toggleFavorite(h.id)}
                    className={`p-1 ${h.favorite ? "text-primary" : "text-muted-foreground hover:text-primary"}`}
                  >
                    <Star className={`size-4 ${h.favorite ? "fill-current" : ""}`} />
                  </button>
                  <button
                    aria-label="Delete"
                    onClick={() => {
                      deleteHistory(h.id);
                      if (selected?.id === h.id) setSelected(null);
                    }}
                    className="p-1 text-muted-foreground hover:text-destructive"
                  >
                    <Trash2 className="size-4" />
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div>
            {selected ? (
              <>
                <div className="mb-3">
                  <div className="text-lg font-semibold">{selected.title}</div>
                  <div className="text-xs text-muted-foreground">
                    {new Date(selected.createdAt).toLocaleString()} · {selected.feature}
                  </div>
                </div>
                <OutputPanel text={selected.output} filename={`chambers-${selected.feature}-${selected.id.slice(0, 6)}`} />
              </>
            ) : (
              <div className="glass grid h-full min-h-[420px] place-items-center rounded-xl text-sm text-muted-foreground">
                Select an entry to view its output.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
