import { createFileRoute, Link } from "@tanstack/react-router";
import { PageHeader } from "@/components/layout/page-header";
import { Settings as SettingsIcon, Moon, Sun, Trash2, Download } from "lucide-react";
import { getPrefs, setPrefs, clearHistory, getHistory } from "@/lib/guest-store";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { LANGUAGES, useLang } from "@/lib/i18n";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAuth } from "@/lib/auth-context";
import { toast } from "sonner";

export const Route = createFileRoute("/_app/settings")({
  head: () => ({ meta: [{ title: "Settings — Chambers OS" }] }),
  component: SettingsPage,
});

function SettingsPage() {
  const { user, isGuest, signOut } = useAuth();
  const { lang, setLang } = useLang();
  const [theme, setTheme] = useState<"dark" | "light">("dark");

  useEffect(() => {
    const p = getPrefs();
    setTheme(p.theme);
  }, []);

  function applyTheme(t: "dark" | "light") {
    setTheme(t);
    setPrefs({ theme: t });
    document.documentElement.classList.toggle("light", t === "light");
  }

  function exportData() {
    const data = { history: getHistory(), prefs: getPrefs() };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `chambers-os-export-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Exported");
  }

  return (
    <div className="mx-auto max-w-3xl px-6 py-8">
      <PageHeader icon={<SettingsIcon className="size-5" />} title="Settings" />

      <div className="glass rounded-xl p-5">
        <div className="text-sm font-semibold">Account</div>
        <div className="mt-3 text-sm text-muted-foreground">
          {isGuest ? (
            <>You are using Chambers OS as a guest. <Link to="/auth" className="text-primary hover:underline">Sign in</Link> to sync across devices.</>
          ) : (
            <>Signed in as <span className="text-foreground">{user?.email}</span></>
          )}
        </div>
        {!isGuest && (
          <Button variant="outline" size="sm" className="mt-3" onClick={signOut}>
            Sign out
          </Button>
        )}
      </div>

      <div className="glass mt-4 rounded-xl p-5">
        <div className="text-sm font-semibold">Appearance</div>
        <div className="mt-3 flex gap-2">
          <Button
            size="sm"
            variant={theme === "dark" ? "default" : "outline"}
            onClick={() => applyTheme("dark")}
          >
            <Moon className="mr-1.5 size-4" /> Dark
          </Button>
          <Button
            size="sm"
            variant={theme === "light" ? "default" : "outline"}
            onClick={() => applyTheme("light")}
          >
            <Sun className="mr-1.5 size-4" /> Light
          </Button>
        </div>
      </div>

      <div className="glass mt-4 rounded-xl p-5">
        <div className="text-sm font-semibold">Language</div>
        <div className="mt-3 max-w-xs">
          <Select value={lang} onValueChange={(v) => setLang(v as typeof lang)}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              {LANGUAGES.map((l) => (
                <SelectItem key={l.code} value={l.code}>{l.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="glass mt-4 rounded-xl p-5">
        <div className="text-sm font-semibold">Data</div>
        <div className="mt-3 flex flex-wrap gap-2">
          <Button size="sm" variant="outline" onClick={exportData}>
            <Download className="mr-1.5 size-4" /> Export data
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => {
              if (confirm("Delete all history? This cannot be undone.")) {
                clearHistory();
                toast.success("History cleared");
              }
            }}
          >
            <Trash2 className="mr-1.5 size-4" /> Delete history
          </Button>
        </div>
      </div>
    </div>
  );
}
