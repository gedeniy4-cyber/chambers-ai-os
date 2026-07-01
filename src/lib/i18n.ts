import { createContext, useContext } from "react";

export type LangCode =
  | "en" | "zu" | "xh" | "af" | "st" | "ts" | "tn" | "pt" | "fr" | "de" | "es";

export const LANGUAGES: { code: LangCode; label: string }[] = [
  { code: "en", label: "English" },
  { code: "zu", label: "isiZulu" },
  { code: "xh", label: "isiXhosa" },
  { code: "af", label: "Afrikaans" },
  { code: "st", label: "Sesotho" },
  { code: "ts", label: "Xitsonga" },
  { code: "tn", label: "Setswana" },
  { code: "pt", label: "Português" },
  { code: "fr", label: "Français" },
  { code: "de", label: "Deutsch" },
  { code: "es", label: "Español" },
];

type Dict = Record<string, string>;
const D: Record<LangCode, Dict> = {
  en: {
    launch: "Launch Workspace",
    demo: "Book Demo",
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
    prompts: "Prompt Library",
    history: "History",
    analytics: "Analytics",
    settings: "Settings",
    signIn: "Sign in",
    signOut: "Sign out",
    guest: "Guest",
    generate: "Generate",
    regenerate: "Regenerate",
    copy: "Copy",
    download: "Download",
    responsibleAi:
      "AI-generated legal content is intended to assist legal professionals and students. It should always be reviewed and verified before use in legal, academic, or professional settings.",
  },
  zu: { launch: "Qalisa", demo: "Buka Demo", dashboard: "Ideshibhodi", generate: "Khiqiza", signIn: "Ngena", signOut: "Phuma", guest: "Isivakashi", responsibleAi: "Okuqukethwe kwe-AI kufanele kubuyekezwe futhi kuqinisekiswe ngaphambi kokusetshenziswa." },
  xh: { launch: "Qalisa", demo: "Buka Demo", dashboard: "Ideshbhodi", generate: "Vela", signIn: "Ngena", signOut: "Phuma", guest: "Undwendwe", responsibleAi: "Umxholo owenziwe yi-AI mawuhlolwe uze uqinisekiswe ngaphambi kokusetyenziswa." },
  af: { launch: "Begin Werkruimte", demo: "Bespreek Demo", dashboard: "Paneelbord", generate: "Genereer", signIn: "Teken in", signOut: "Teken uit", guest: "Gas", responsibleAi: "KI-inhoud moet altyd nagegaan en geverifieer word voor gebruik." },
  st: { launch: "Qala", demo: "Behola Demo", dashboard: "Boto", generate: "Hlahisa", signIn: "Kena", signOut: "Tswa", guest: "Moeti", responsibleAi: "Litaba tsa AI li lokela ho hlahlojoa pele li sebelisoa." },
  ts: { launch: "Sungula", demo: "Vonelela Demo", dashboard: "Xitulu", generate: "Endla", signIn: "Nghena", signOut: "Huma", guest: "Muendzi", responsibleAi: "Vuxokoxoko bya AI byi fanele byi kamberiwa loko byi nga si tirhisiwa." },
  tn: { launch: "Simolola", demo: "Bona Demo", dashboard: "Letlhomeso", generate: "Tlhagisa", signIn: "Tsena", signOut: "Tswa", guest: "Moeng", responsibleAi: "Diteng tsa AI di tshwanetse go tlhatlhojwa pele di dirisiwa." },
  pt: { launch: "Abrir Workspace", demo: "Agendar Demo", dashboard: "Painel", generate: "Gerar", signIn: "Entrar", signOut: "Sair", guest: "Convidado", responsibleAi: "Conteúdo gerado por IA deve ser revisado e verificado antes do uso." },
  fr: { launch: "Ouvrir l'espace", demo: "Réserver démo", dashboard: "Tableau de bord", generate: "Générer", signIn: "Connexion", signOut: "Déconnexion", guest: "Invité", responsibleAi: "Le contenu généré par IA doit être vérifié avant utilisation." },
  de: { launch: "Workspace öffnen", demo: "Demo buchen", dashboard: "Dashboard", generate: "Erzeugen", signIn: "Anmelden", signOut: "Abmelden", guest: "Gast", responsibleAi: "KI-generierte Inhalte sollten vor der Verwendung geprüft werden." },
  es: { launch: "Abrir Workspace", demo: "Agendar Demo", dashboard: "Panel", generate: "Generar", signIn: "Entrar", signOut: "Salir", guest: "Invitado", responsibleAi: "El contenido generado por IA debe revisarse antes de usarse." },
};

export const I18nContext = createContext<{ lang: LangCode; setLang: (l: LangCode) => void }>({
  lang: "en",
  setLang: () => {},
});

export function useT() {
  const { lang } = useContext(I18nContext);
  return (key: string) => D[lang]?.[key] ?? D.en[key] ?? key;
}
export function useLang() {
  return useContext(I18nContext);
}
