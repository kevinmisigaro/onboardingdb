"use client";

import Link from "next/link";
import { useState } from "react";
import { FORM_ORDER, FormId, getSchemas } from "@/lib/schema";
import { setKlantNaam } from "@/lib/engine";
import { Lang, setLang, useT } from "@/lib/i18n";
import { useFormProgressLive, useKlantNaamLive } from "@/lib/hooks";

function statusBadge(progress: number, doneLabel: string): { text: string; cls: string } {
  if (progress >= 100) return { text: doneLabel, cls: "done" };
  if (progress > 0) return { text: `${progress}%`, cls: "progress" };
  return { text: "", cls: "" };
}

function LanguageSwitch({ lang }: { lang: Lang }) {
  return (
    <div className="lang-switch" role="group" aria-label="Language">
      {(["nl", "en"] as Lang[]).map((l) => (
        <button
          key={l}
          type="button"
          className={`lang-switch-btn${lang === l ? " active" : ""}`}
          onClick={() => setLang(l)}
        >
          {l.toUpperCase()}
        </button>
      ))}
    </div>
  );
}

interface ShellProps {
  active: "dashboard" | FormId;
  /** Live progress for the active form, supplied by the page as the user types,
      so the badge updates without waiting for a reload. */
  progressOverride?: number;
  children: React.ReactNode;
}

export default function Shell({ active, progressOverride, children }: ShellProps) {
  const { lang, t } = useT();
  const schemas = getSchemas(lang);
  const NAV_ITEMS: { id: "dashboard" | FormId; label: string; href: string; icon: string }[] = [
    { id: "dashboard", label: t.overview, href: "/", icon: "🏠" },
    ...FORM_ORDER.map((id) => ({ id, label: schemas[id].menuLabel, href: `/${id}`, icon: schemas[id].icon })),
  ];

  // useSyncExternalStore keeps these hydration-safe: server and the client's
  // first paint both see the default snapshot, then React syncs to the real
  // localStorage value right after hydration — no setState-in-effect needed.
  const klant = useKlantNaamLive();
  const progressReparatieonderhoud = useFormProgressLive("reparatieonderhoud");
  const progressMutatieonderhoud = useFormProgressLive("mutatieonderhoud");
  const progressInkoopregister = useFormProgressLive("inkoopregister");
  const progressContactcenter = useFormProgressLive("contactcenter");
  const progressMap: Record<FormId, number> = {
    reparatieonderhoud: progressReparatieonderhoud,
    mutatieonderhoud: progressMutatieonderhoud,
    inkoopregister: progressInkoopregister,
    contactcenter: progressContactcenter,
  };

  const [editingKlant, setEditingKlant] = useState(false);
  const [draftKlant, setDraftKlant] = useState("");
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  function progressFor(id: FormId) {
    return active === id && progressOverride !== undefined ? progressOverride : progressMap[id];
  }

  function startEditingKlant() {
    setDraftKlant(klant);
    setEditingKlant(true);
  }

  function saveKlant() {
    setKlantNaam(draftKlant.trim());
    setEditingKlant(false);
  }

  return (
    <div className="app-shell">
      <div className="topbar">
        <button className="mobile-menu-btn" onClick={() => setMobileNavOpen((v) => !v)} aria-label={t.menuAriaLabel}>
          ☰
        </button>
        <Link href="/" className="topbar-logo">
          <span className="topbar-logo-chip">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo.svg" alt="DataBalk" width={28} height={28} />
            <span className="topbar-logo-text">DataBalk&nbsp;|&nbsp;Onboarding Portal</span>
          </span>
        </Link>
        <div className="topbar-right">
          {editingKlant ? (
            <input
              className="input"
              style={{ width: 200, padding: "4px 8px", fontSize: 13 }}
              autoFocus
              value={draftKlant}
              onChange={(e) => setDraftKlant(e.target.value)}
              onBlur={saveKlant}
              onKeyDown={(e) => {
                if (e.key === "Enter") saveKlant();
                if (e.key === "Escape") setEditingKlant(false);
              }}
            />
          ) : (
            <button className="topbar-klant" onClick={startEditingKlant}>
              {klant ? `${t.clientLabel}: ${klant}` : t.setClientName}
            </button>
          )}
          <LanguageSwitch lang={lang} />
        </div>
      </div>
      <div className="body-area">
        <div className={`sidebar${mobileNavOpen ? " open" : ""}`}>
          <div className="sidebar-section-label">{t.onboardingSectionLabel}</div>
          {NAV_ITEMS.map((item) => {
            const isActive = item.id === active;
            const badge = item.id !== "dashboard" ? statusBadge(progressFor(item.id as FormId), t.done) : null;
            return (
              <Link key={item.id} href={item.href} className={`nav-item${isActive ? " active" : ""}`}>
                <span className="nav-icon">{item.icon}</span>
                {item.label}
                {badge && badge.text && <span className={`nav-item-status ${badge.cls}`}>{badge.text}</span>}
              </Link>
            );
          })}
        </div>
        <div className="main-content">{children}</div>
      </div>
    </div>
  );
}
