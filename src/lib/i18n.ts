"use client";

import { useSyncExternalStore } from "react";

export type Lang = "nl" | "en";

const LANG_KEY = "db_lang";

/* Minimal external store (not React Context) so a language change made in
   one component — e.g. the switcher in Shell — immediately re-renders every
   other mounted component that reads the language, without prop drilling. */

let currentLang: Lang = "nl";
const listeners = new Set<() => void>();

if (typeof window !== "undefined") {
  try {
    const stored = window.localStorage.getItem(LANG_KEY);
    if (stored === "nl" || stored === "en") currentLang = stored;
  } catch {
    /* ignore privacy-mode errors */
  }
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function getSnapshot(): Lang {
  return currentLang;
}

// Server (and the client's first paint) always render "nl"; React re-syncs
// to the real stored value right after hydration, the same hydration-safe
// pattern used by the localStorage-backed hooks in lib/hooks.ts.
function getServerSnapshot(): Lang {
  return "nl";
}

export function setLang(lang: Lang) {
  currentLang = lang;
  if (typeof window !== "undefined") {
    try {
      window.localStorage.setItem(LANG_KEY, lang);
    } catch {
      /* ignore quota / privacy-mode errors */
    }
    document.documentElement.lang = lang;
  }
  listeners.forEach((l) => l());
}

export function useLang(): Lang {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

/* ---------------- UI chrome strings ---------------- */

export const UI = {
  nl: {
    overview: "Overzicht",
    done: "Klaar",
    clientLabel: "Klant",
    setClientName: "Klantnaam instellen",
    onboardingSectionLabel: "Onboarding",
    menuAriaLabel: "Menu",
    heroTitle: "Onboarding",
    heroSubtitle:
      "Om uw omgeving goed te kunnen inrichten hebben we een aantal inventarisaties nodig. Doorloop de onderstaande formulieren — uw antwoorden worden automatisch lokaal bewaard en kunnen op elk moment als Excel-bestand worden geëxporteerd voor verdere verwerking.",
    percentCompletedSuffix: "ingevuld",
    continueLabel: "Doorgaan →",
    doneCheck: "✓ Klaar",
    yes: "Ja",
    no: "Nee",
    remove: "Verwijderen",
    defaultItemLabel: "Item",
    addItem: (label: string) => `+ ${label} toevoegen`,
    selectPlaceholder: "Maak een keuze...",
    autoSaved: "Automatisch opgeslagen",
    backToOverview: "← Terug naar overzicht",
    save: "💾 Opslaan",
    questionHeader: "Vraag",
    answerHeader: "Antwoord",
    previous: "← Vorige",
    next: "Volgende →",
    toReview: "Naar overzicht antwoorden →",
    questionLabel: "Vraag",
    ofLabel: "van",
    reviewSectionLabel: "Controleren",
    reviewTitle: "Controleer uw antwoorden",
    reviewDesc: "Loop uw antwoorden na voordat u opslaat. Klik op ✎ Bewerken om een antwoord aan te passen.",
    edit: "✎ Bewerken",
    noAnswer: "Nog niet ingevuld",
  },
  en: {
    overview: "Overview",
    done: "Done",
    clientLabel: "Client",
    setClientName: "Set client name",
    onboardingSectionLabel: "Onboarding",
    menuAriaLabel: "Menu",
    heroTitle: "Onboarding",
    heroSubtitle:
      "To properly configure your environment, we need a number of inventories. Work through the forms below — your answers are automatically saved locally and can be exported as an Excel file at any time for further processing.",
    percentCompletedSuffix: "completed",
    continueLabel: "Continue →",
    doneCheck: "✓ Done",
    yes: "Yes",
    no: "No",
    remove: "Remove",
    defaultItemLabel: "Item",
    addItem: (label: string) => `+ Add ${label}`,
    selectPlaceholder: "Make a choice...",
    autoSaved: "Automatically saved",
    backToOverview: "← Back to overview",
    save: "💾 Save",
    questionHeader: "Question",
    answerHeader: "Answer",
    previous: "← Previous",
    next: "Next →",
    toReview: "Review answers →",
    questionLabel: "Question",
    ofLabel: "of",
    reviewSectionLabel: "Review",
    reviewTitle: "Review your answers",
    reviewDesc: "Check your answers before saving. Click ✎ Edit to change an answer.",
    edit: "✎ Edit",
    noAnswer: "Not answered yet",
  },
} as const satisfies Record<Lang, Record<string, string | ((label: string) => string)>>;

export function useT() {
  const lang = useLang();
  return { lang, t: UI[lang] };
}
