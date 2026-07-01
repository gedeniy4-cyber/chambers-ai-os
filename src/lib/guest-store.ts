// Local persistence for guest users. Same shape as future DB rows.

export type HistoryItem = {
  id: string;
  feature: string;
  title: string;
  prompt: Record<string, unknown>;
  output: string;
  createdAt: number;
  favorite?: boolean;
};

const HISTORY_KEY = "chambers.history.v1";
const PREFS_KEY = "chambers.prefs.v1";
const TIER_KEY = "chambers.tier.v1";

export type Prefs = {
  language: string;
  theme: "dark" | "light";
};

export type Tier = "basic" | "pro" | "premium_single" | "premium_family" | "business";

export const defaultPrefs: Prefs = { language: "en", theme: "dark" };

function safeGet<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}
function safeSet(key: string, value: unknown) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* ignore */
  }
}

// History
export const getHistory = () => safeGet<HistoryItem[]>(HISTORY_KEY, []);
export function addHistory(item: Omit<HistoryItem, "id" | "createdAt">): HistoryItem {
  const next: HistoryItem = {
    ...item,
    id: crypto.randomUUID(),
    createdAt: Date.now(),
  };
  const all = [next, ...getHistory()].slice(0, 200);
  safeSet(HISTORY_KEY, all);
  window.dispatchEvent(new Event("chambers:history-changed"));
  return next;
}
export function deleteHistory(id: string) {
  safeSet(HISTORY_KEY, getHistory().filter((h) => h.id !== id));
  window.dispatchEvent(new Event("chambers:history-changed"));
}
export function toggleFavorite(id: string) {
  safeSet(
    HISTORY_KEY,
    getHistory().map((h) => (h.id === id ? { ...h, favorite: !h.favorite } : h)),
  );
  window.dispatchEvent(new Event("chambers:history-changed"));
}
export function clearHistory() {
  safeSet(HISTORY_KEY, []);
  window.dispatchEvent(new Event("chambers:history-changed"));
}

// Prefs
export const getPrefs = () => safeGet<Prefs>(PREFS_KEY, defaultPrefs);
export const setPrefs = (p: Partial<Prefs>) => {
  const merged = { ...getPrefs(), ...p };
  safeSet(PREFS_KEY, merged);
  window.dispatchEvent(new Event("chambers:prefs-changed"));
  return merged;
};

// Tier (simulated subscription for signed-in users; guests are unlimited anyway)
export const getTier = () => safeGet<Tier>(TIER_KEY, "basic");
export const setTier = (t: Tier) => {
  safeSet(TIER_KEY, t);
  window.dispatchEvent(new Event("chambers:tier-changed"));
};
