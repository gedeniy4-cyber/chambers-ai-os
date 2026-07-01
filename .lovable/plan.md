
# Chambers OS — Build Plan (v2)

Change from v1: **Guest mode is unlimited and fully functional** — every feature, every tier's tools, no daily cap, no upgrade gates. Signing in only adds cross-device persistence and (for `creator@chambersos.com`) the admin dashboard.

## Key decisions

1. **AI provider**: Lovable AI Gateway (server-side, no key setup, OpenAI-compatible so swapping to OpenAI/Anthropic/Gemini later is a single-file change in `ai-service.server.ts`). Say the word if you want your own OpenAI key instead.
2. **Auth**: Google + email/password via Lovable Cloud. Microsoft SSO shown as "Coming soon" (not natively supported).
3. **Google OAuth JSON you pasted**: not needed — Lovable Cloud manages Google sign-in.
4. **Backend**: Lovable Cloud (Postgres + auth + storage) for authed users. Guests use `localStorage`.

## Guest vs signed-in vs creator

| Capability | Guest | Basic/Pro/Premium signed-in | `creator@chambersos.com` |
|---|---|---|---|
| All AI features (Email, Summarizer, Planner, Research, Chat, Drafting, Contract, Citations, Strategy, Timeline, Court Prep, Argument Builder, Writing Coach, Prompts) | ✅ Unlimited | Per selected tier | ✅ Unlimited |
| History / analytics | ✅ localStorage | ✅ Cloud, cross-device | ✅ + all users |
| Attachments, export, edit, regen | ✅ | ✅ | ✅ |
| Admin dashboard | — | — | ✅ |
| Optional sign-in prompt | Soft banner "Sign in to sync across devices" | — | — |

Tier gating and daily-limit UI still exist for signed-in users (per your spec), but **guests bypass all gates**. `UpgradeGate` renders children directly when `isGuest === true`.

## Architecture

```text
src/
  routes/
    __root.tsx           theme, i18n, auth listener, toaster, guest bootstrap
    index.tsx            landing + animated "By Yondela Gedeni · Sponsored by CAPACITI"
    auth.tsx             login/register/forgot + Google (optional)
    pricing.tsx          ZAR plans, simulated checkout (signed-in only)
    _app/                sidebar + topbar shell, works for guest OR authed
      dashboard.tsx  email.tsx  summarizer.tsx  planner.tsx  research.tsx
      chat.tsx  drafting.tsx  contract.tsx  citations.tsx  strategy.tsx
      timeline.tsx  court-prep.tsx  argument.tsx  writing-coach.tsx
      prompts.tsx  history.tsx  analytics.tsx  settings.tsx  admin.tsx
    api/chat.ts          streaming chat endpoint (guest-allowed)
  lib/
    ai.functions.ts      single generate() entry, provider-agnostic
    ai-service.server.ts pluggable adapter (Lovable AI today)
    prompts/*            one file per feature, prompts separated from UI
    usage.ts             limit check — no-op for guests & creator
    subscription.ts      tier → features; guest = full unlock
    guest-store.ts       typed localStorage repo (history, prefs, attachments meta)
    i18n.ts              11 languages
  components/
    layout/ (Sidebar, Topbar, GuestBanner, ResponsibleAiNote, LangSwitcher)
    ai/ (PromptForm, OutputPanel, AttachmentPicker, UsageMeter, UpgradeGate)
    ui/ (shadcn)
```

## Database (Lovable Cloud, signed-in users only)

- `profiles`, `user_roles` (admin via `has_role()` SECURITY DEFINER)
- `subscriptions` (tier, seat_type)
- `usage_daily` (feature counters — not written for guests/creator)
- `history` (feature, prompt, output, favorite)
- `attachments` + private storage bucket

All tables RLS-scoped to `auth.uid()`; admin role reads all. On first sign-in, guest `localStorage` history is uploaded and cleared.

## Subscriptions (ZAR, signed-in only, simulated)

Basic R0 · Pro R299 · Premium Single R699 · Family R1 499 · Business from R4 999. Upgrade writes a `subscriptions` row; no gateway. Guests never see paywalls.

## AI service (one entry point)

```ts
export const generate = createServerFn({ method: "POST" })
  .inputValidator(schema)   // { feature, input, attachments?, guestId? }
  .handler(async ({ data, context }) => {
    const identity = await resolveIdentity(context);  // guest | user | creator
    if (identity.kind === "user") await assertWithinLimit(identity, data.feature);
    const prompt = buildPrompt(data.feature, data.input, data.attachments);
    const out = await aiService.complete(prompt);
    if (identity.kind === "user") await recordHistoryAndUsage(identity, data, out);
    return out;
  });
```

Chat streams via `/api/chat`. Swapping providers later = edit `ai-service.server.ts` only. Attachments (PDF/DOCX/TXT/images + URL/Drive/OneDrive/Dropbox links) parsed server-side and injected into the prompt.

## Outputs & UX (every feature)

Tiptap rich-text editor · Copy · Regenerate · Continue · Improve · Summarize · Expand · Export PDF/DOCX/TXT · Print · Share. Loading skeletons, Sonner toasts, framer-motion micro-animations, error boundaries, empty states ("No emails generated yet." etc.), Responsible-AI disclaimer on every AI page.

## Landing & dashboard

- Hero: "Chambers OS" · "The AI Operating System for Modern Legal Professionals." · **Launch Workspace** (→ `/dashboard` as guest, zero friction) · **Book Demo** modal · animated dashboard preview.
- Animated transitioning line: **"By Yondela Gedeni" ↔ "Sponsored by CAPACITI"** (crossfade + slide).
- Features grid, testimonials, ZAR pricing, FAQ, footer.
- Dashboard starts at zero — stats populate only from real actions (guest counters kept in localStorage).

## i18n

react-i18next: English, isiZulu, isiXhosa, Afrikaans, Sesotho, Xitsonga, Setswana, Portuguese, French, German, Spanish. Persisted per guest/user.

## Out of scope for v1

- Real payment gateway (simulated per your spec)
- Native Microsoft SSO (Lovable Cloud limitation)
- Real voice input (mic is a placeholder per your spec)

## Delivery order

1. Cloud + auth + roles + tables + RLS
2. Layout shell, theme, i18n, guest bootstrap, usage meter (hidden for guests)
3. AI service + prompts + Email feature end-to-end as template
4. Clone remaining features
5. History, analytics, settings, pricing/upgrade, admin
6. Landing + polish + responsive pass

Approve to build, or tell me what to change.
