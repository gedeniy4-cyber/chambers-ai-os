import type { Tier } from "./guest-store";

export type PlanFeature = string;

export const PLANS: {
  id: Tier;
  name: string;
  priceZAR: number;
  billing: string;
  tagline: string;
  features: string[];
  cta?: string;
}[] = [
  {
    id: "basic",
    name: "Basic",
    priceZAR: 0,
    billing: "Free forever",
    tagline: "Everything you need to get started.",
    features: [
      "10 AI requests per day",
      "Legal Email Generator",
      "Meeting Notes Summarizer",
      "Save recent history",
      "Limited AI Chat",
    ],
  },
  {
    id: "pro",
    name: "Pro",
    priceZAR: 299,
    billing: "per month",
    tagline: "For working professionals.",
    features: [
      "Everything in Basic",
      "10 premium AI requests / day",
      "AI Task Planner",
      "Legal Research Assistant",
      "Unlimited saved history",
      "Priority processing",
      "Export documents",
    ],
    cta: "Upgrade to Pro",
  },
  {
    id: "premium_single",
    name: "Premium — Single",
    priceZAR: 699,
    billing: "per month",
    tagline: "Full arsenal for one attorney.",
    features: [
      "Unlimited AI requests",
      "Advanced Legal Drafting",
      "Contract Review",
      "Citation Generator",
      "Case Strategy Assistant",
      "Court Preparation Assistant",
      "Saved Workspaces",
      "Priority AI",
    ],
    cta: "Go Premium",
  },
  {
    id: "premium_family",
    name: "Premium — Family",
    priceZAR: 1499,
    billing: "per month · up to 5 users",
    tagline: "Small team, shared workspaces.",
    features: [
      "Everything in Premium Single",
      "Up to 5 seats",
      "Shared prompt library",
      "Team history",
    ],
  },
  {
    id: "business",
    name: "Business",
    priceZAR: 4999,
    billing: "from R4 999 / month",
    tagline: "Law firms and legal departments.",
    features: [
      "Unlimited seats",
      "Firm-wide workspaces",
      "Analytics dashboard",
      "SSO on request",
      "Priority support",
      "Early access features",
    ],
  },
];

// What a tier unlocks (used only for signed-in users; guests are always full).
const TIER_FEATURES: Record<Tier, Set<string>> = {
  basic: new Set(["email", "summarizer", "chat", "prompts"]),
  pro: new Set(["email", "summarizer", "chat", "prompts", "planner", "research"]),
  premium_single: new Set([
    "email", "summarizer", "chat", "prompts", "planner", "research",
    "drafting", "contract", "citations", "strategy", "timeline",
    "court_prep", "argument", "writing_coach",
  ]),
  premium_family: new Set([
    "email", "summarizer", "chat", "prompts", "planner", "research",
    "drafting", "contract", "citations", "strategy", "timeline",
    "court_prep", "argument", "writing_coach",
  ]),
  business: new Set([
    "email", "summarizer", "chat", "prompts", "planner", "research",
    "drafting", "contract", "citations", "strategy", "timeline",
    "court_prep", "argument", "writing_coach", "admin", "analytics",
  ]),
};

export function tierUnlocks(tier: Tier, feature: string, isGuest: boolean) {
  if (isGuest) return true; // Guest mode is unlimited & fully functional
  return TIER_FEATURES[tier]?.has(feature) ?? false;
}

export const formatZAR = (n: number) =>
  n === 0
    ? "R0"
    : new Intl.NumberFormat("en-ZA", {
        style: "currency",
        currency: "ZAR",
        maximumFractionDigits: 0,
      }).format(n);
