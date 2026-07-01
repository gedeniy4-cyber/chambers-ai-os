import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, useState, type ReactNode } from "react";
import { Toaster } from "@/components/ui/sonner";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";
import { AuthProvider } from "@/lib/auth-context";
import { I18nContext, type LangCode } from "@/lib/i18n";
import { getPrefs, setPrefs } from "@/lib/guest-store";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center hero-radial px-4">
      <div className="glass max-w-md rounded-2xl p-10 text-center">
        <h1 className="gold-gradient-text text-7xl font-bold">404</h1>
        <h2 className="mt-4 text-xl font-semibold">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for doesn't exist.
        </p>
        <Link
          to="/"
          className="mt-6 inline-flex items-center justify-center rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition hover:opacity-90"
        >
          Go home
        </Link>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center hero-radial px-4">
      <div className="glass max-w-md rounded-2xl p-8 text-center">
        <h1 className="text-xl font-semibold tracking-tight">Something went wrong</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          {error?.message || "Please try again."}
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90"
          >
            Try again
          </button>
          <a
            href="/"
            className="rounded-lg border border-border px-4 py-2 text-sm font-medium hover:bg-accent"
          >
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Chambers OS — The AI Operating System for Modern Legal Professionals" },
      {
        name: "description",
        content:
          "AI-powered productivity for law students, attorneys, advocates and legal teams. Draft emails, summarise meetings, run research, and plan matters — all in one workspace.",
      },
      { name: "author", content: "Yondela Gedeni · Sponsored by CAPACITI" },
      { property: "og:title", content: "Chambers OS — The AI Operating System for Modern Legal Professionals" },
      { property: "og:description", content: "Chambers OS is an AI-powered productivity platform for legal professionals." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "Chambers OS — The AI Operating System for Modern Legal Professionals" },
      { name: "description", content: "Chambers OS is an AI-powered productivity platform for legal professionals." },
      { name: "twitter:description", content: "Chambers OS is an AI-powered productivity platform for legal professionals." },
      { property: "og:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/1785924c-35db-4970-992e-774c73a805f3/id-preview-3f74dd4b--5d7ef62a-aeef-4932-806d-f8331da9ceef.lovable.app-1782882363825.png" },
      { name: "twitter:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/1785924c-35db-4970-992e-774c73a805f3/id-preview-3f74dd4b--5d7ef62a-aeef-4932-806d-f8331da9ceef.lovable.app-1782882363825.png" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=Playfair+Display:wght@600;700&display=swap",
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  const [lang, setLangState] = useState<LangCode>("en");

  useEffect(() => {
    const p = getPrefs();
    setLangState((p.language as LangCode) || "en");
    // Apply theme class
    if (typeof document !== "undefined") {
      document.documentElement.classList.toggle("light", p.theme === "light");
    }
  }, []);

  const setLang = (l: LangCode) => {
    setLangState(l);
    setPrefs({ language: l });
  };

  return (
    <QueryClientProvider client={queryClient}>
      <I18nContext.Provider value={{ lang, setLang }}>
        <AuthProvider>
          <Outlet />
          <Toaster position="top-right" richColors />
        </AuthProvider>
      </I18nContext.Provider>
    </QueryClientProvider>
  );
}
