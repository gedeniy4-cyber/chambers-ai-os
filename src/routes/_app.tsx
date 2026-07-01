import { Link, Outlet, useRouterState } from "@tanstack/react-router";
import { createFileRoute } from "@tanstack/react-router";
import {
  LayoutDashboard, Mail, MessageSquare, FileText, ListChecks, Search,
  FilePen, ShieldCheck, Quote, Target, Clock, Gavel, ScrollText, GraduationCap,
  History, BarChart3, Settings, LogOut, LogIn, Sparkles, User, ShieldAlert,
  Menu, X,
} from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { useT, useLang, LANGUAGES } from "@/lib/i18n";
import { getTier } from "@/lib/guest-store";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
  DropdownMenuLabel, DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

export const Route = createFileRoute("/_app")({
  component: AppLayout,
});

const NAV = [
  { to: "/dashboard", icon: LayoutDashboard, key: "dashboard" },
  { section: "AI Tools" as const },
  { to: "/email", icon: Mail, key: "email" },
  { to: "/chat", icon: MessageSquare, key: "chat" },
  { to: "/summarizer", icon: FileText, key: "summarizer" },
  { to: "/planner", icon: ListChecks, key: "planner" },
  { to: "/research", icon: Search, key: "research" },
  { section: "Premium Suite" as const },
  { to: "/drafting", icon: FilePen, key: "drafting" },
  { to: "/contract", icon: ShieldCheck, key: "contract" },
  { to: "/citations", icon: Quote, key: "citations" },
  { to: "/strategy", icon: Target, key: "strategy" },
  { to: "/timeline", icon: Clock, key: "timeline" },
  { to: "/court-prep", icon: Gavel, key: "court_prep" },
  { to: "/argument", icon: ScrollText, key: "argument" },
  { to: "/writing-coach", icon: GraduationCap, key: "writing_coach" },
  { section: "Workspace" as const },
  { to: "/prompts", icon: Sparkles, key: "prompts" },
  { to: "/history", icon: History, key: "history" },
  { to: "/analytics", icon: BarChart3, key: "analytics" },
  { to: "/settings", icon: Settings, key: "settings" },
];

const LABELS: Record<string, string> = {
  dashboard: "Dashboard",
  email: "Email Generator",
  chat: "AI Chat",
  summarizer: "Meeting Summarizer",
  planner: "Task Planner",
  research: "Research Assistant",
  drafting: "Legal Drafting",
  contract: "Contract Review",
  citations: "Citation Generator",
  strategy: "Case Strategy",
  timeline: "Case Timeline",
  court_prep: "Court Preparation",
  argument: "Argument Builder",
  writing_coach: "Writing Coach",
  prompts: "Prompt Library",
  history: "History",
  analytics: "Analytics",
  settings: "Settings",
};

function AppLayout() {
  const { user, isGuest, isCreator, signOut } = useAuth();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const t = useT();
  const { lang, setLang } = useLang();
  const [mobileOpen, setMobileOpen] = useState(false);
  const tier = getTier();

  const Sidebar = (
    <aside className="flex h-full w-64 shrink-0 flex-col border-r border-border bg-sidebar text-sidebar-foreground">
      <Link to="/" className="flex items-center gap-2 border-b border-border px-5 py-5">
        <div className="grid size-9 place-items-center rounded-lg bg-primary text-primary-foreground shadow-md shadow-primary/20">
          <Gavel className="size-5" />
        </div>
        <div>
          <div className="text-sm font-semibold tracking-tight">Chambers OS</div>
          <div className="text-[10px] uppercase tracking-widest text-muted-foreground">
            Legal AI Workspace
          </div>
        </div>
      </Link>
      <nav className="flex-1 overflow-y-auto px-3 py-4">
        {NAV.map((item, i) => {
          if ("section" in item) {
            return (
              <div
                key={`s-${i}`}
                className="mt-4 px-3 pb-1 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground"
              >
                {item.section}
              </div>
            );
          }
          const Icon = item.icon;
          const active = pathname === item.to;
          return (
            <Link
              key={item.to}
              to={item.to}
              onClick={() => setMobileOpen(false)}
              className={cn(
                "group my-0.5 flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition",
                active
                  ? "bg-sidebar-accent text-sidebar-accent-foreground"
                  : "text-sidebar-foreground/80 hover:bg-sidebar-accent/60 hover:text-sidebar-foreground",
              )}
            >
              <Icon className={cn("size-4 transition", active ? "text-primary" : "text-muted-foreground group-hover:text-foreground")} />
              <span className="truncate">{LABELS[item.key]}</span>
            </Link>
          );
        })}
      </nav>
      <div className="border-t border-border p-3 text-xs text-muted-foreground">
        <div className="rounded-lg bg-accent/40 p-3">
          {isGuest ? (
            <>
              <div className="mb-1 flex items-center gap-1 font-semibold text-foreground">
                <ShieldAlert className="size-3.5 text-primary" /> Guest Mode
              </div>
              <p>All features unlocked. Sign in to sync across devices.</p>
              <Link to="/auth" className="mt-2 inline-block text-primary hover:underline">
                Sign in →
              </Link>
            </>
          ) : (
            <>
              <div className="font-semibold text-foreground">
                {isCreator ? "Creator Mode" : `${tier.replace("_", " ")} plan`}
              </div>
              <p className="truncate">{user?.email}</p>
            </>
          )}
        </div>
      </div>
    </aside>
  );

  return (
    <div className="flex min-h-screen bg-background">
      {/* Desktop sidebar */}
      <div className="hidden md:block">{Sidebar}</div>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          <div className="animate-in fade-in flex h-full">{Sidebar}</div>
          <button
            className="flex-1 bg-black/60"
            onClick={() => setMobileOpen(false)}
            aria-label="Close menu"
          />
        </div>
      )}

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-30 flex items-center gap-3 border-b border-border bg-background/70 px-4 py-3 backdrop-blur">
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setMobileOpen((v) => !v)}
          >
            {mobileOpen ? <X className="size-5" /> : <Menu className="size-5" />}
          </Button>

          <div className="flex flex-1 items-center gap-2">
            <Badge variant="outline" className="border-primary/30 bg-primary/10 text-primary">
              {isCreator ? "Creator" : isGuest ? t("guest") : tier.replace("_", " ")}
            </Badge>
            <div className="hidden text-sm text-muted-foreground sm:block">
              AI-powered legal workspace
            </div>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="gap-1">
                🌐 <span className="hidden sm:inline">{LANGUAGES.find(l => l.code === lang)?.label}</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="max-h-72 overflow-y-auto">
              <DropdownMenuLabel>Language</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {LANGUAGES.map((l) => (
                <DropdownMenuItem key={l.code} onClick={() => setLang(l.code)}>
                  {l.label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-full">
                <User className="size-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>
                {isGuest ? "Guest session" : user?.email}
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link to="/settings">Settings</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="/pricing">Pricing</Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              {isGuest ? (
                <DropdownMenuItem asChild>
                  <Link to="/auth">
                    <LogIn className="mr-2 size-4" /> Sign in
                  </Link>
                </DropdownMenuItem>
              ) : (
                <DropdownMenuItem onClick={signOut}>
                  <LogOut className="mr-2 size-4" /> Sign out
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </header>

        <main className="min-w-0 flex-1">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
