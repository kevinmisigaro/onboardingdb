"use client";

import Link from "next/link";
import { FORM_ORDER, FormId, getSchemas } from "@/lib/schema";
import { useFormProgressLive } from "@/lib/hooks";
import { useT } from "@/lib/i18n";
import Shell from "@/components/Shell";

const DESCRIPTIONS = {
  nl: {
    reparatieonderhoud: "Inrichting van CRM, Field Service, Onderhoudsketen en financiële afhandeling voor het reparatieproces.",
    mutatieonderhoud: "Inrichting van CRM, Field Service, Onderhoudsketen, Inspectic en financiële afhandeling voor mutatieonderhoud.",
    inkoopregister: "Vastlegging van administratieve inkoop, inkooporders, declaraties en de bijbehorende audittrail.",
    contactcenter: "Inventarisatie van de huidige telefonie, call flows, contact center-functionaliteit en het netwerk voor de inrichting van het contact center.",
  },
  en: {
    reparatieonderhoud: "Configuration of CRM, Field Service, the maintenance chain, and financial processing for the repair process.",
    mutatieonderhoud: "Configuration of CRM, Field Service, the maintenance chain, Inspectic, and financial processing for turnover maintenance.",
    inkoopregister: "Recording of administrative procurement, purchase orders, expense claims, and the associated audit trail.",
    contactcenter: "Inventory of the current telephony, call flows, contact center functionality, and network for setting up the contact center.",
  },
} satisfies Record<"nl" | "en", Record<FormId, string>>;

const ACCENTS: Record<FormId, "rose" | "green" | "slate" | "cyan"> = {
  reparatieonderhoud: "rose",
  mutatieonderhoud: "green",
  inkoopregister: "slate",
  contactcenter: "cyan",
};

const BADGES: Record<FormId, string> = {
  reparatieonderhoud: "A",
  mutatieonderhoud: "B",
  inkoopregister: "C",
  contactcenter: "D",
};

export default function Dashboard() {
  const { lang, t } = useT();
  const schemas = getSchemas(lang);
  const descriptions = DESCRIPTIONS[lang];

  const progressReparatieonderhoud = useFormProgressLive("reparatieonderhoud");
  const progressMutatieonderhoud = useFormProgressLive("mutatieonderhoud");
  const progressInkoopregister = useFormProgressLive("inkoopregister");
  const progressContactcenter = useFormProgressLive("contactcenter");
  const progress: Record<FormId, number> = {
    reparatieonderhoud: progressReparatieonderhoud,
    mutatieonderhoud: progressMutatieonderhoud,
    inkoopregister: progressInkoopregister,
    contactcenter: progressContactcenter,
  };

  return (
    <Shell active="dashboard">
      <div className="hero-banner">
        <div className="hero-icon-circle">🧭</div>
        <div className="hero-content">
          <div className="hero-title">{t.heroTitle}</div>
          <div className="hero-subtitle">{t.heroSubtitle}</div>
        </div>
        <div className="hero-art" aria-hidden="true">
          <span className="hero-art-shape shape-1" />
          <span className="hero-art-shape shape-2" />
          <span className="hero-art-shape shape-3" />
          <span className="hero-art-glyph">📋</span>
        </div>
      </div>

      <div className="process-tree-wrap" aria-hidden="true">
        <div className="process-tree-stem" />
        <div className="process-tree-trunk" />
      </div>

      <div className="form-grid">
        {FORM_ORDER.map((id) => {
          const schema = schemas[id];
          const pct = progress[id];
          const accent = ACCENTS[id];
          return (
            <Link key={id} href={`/${id}`} className={`form-card accent-${accent}`}>
              <div className="form-card-art">
                <span className="form-card-art-glyph">{schema.icon}</span>
                <span className="form-card-icon-circle">{schema.icon}</span>
              </div>
              <div className="form-card-body">
                <div className="form-card-title">{schema.title}</div>
                <div className="form-card-desc">{descriptions[id]}</div>
              </div>
              <div className="progress-track">
                <div className="progress-fill" style={{ width: `${pct}%` }} />
              </div>
              <div className="progress-label">
                <span>{pct}% {t.percentCompletedSuffix}</span>
                <span>{pct >= 100 ? t.doneCheck : t.continueLabel}</span>
              </div>
              <div className="form-card-footer">
                <span className="form-card-badge">{BADGES[id]}</span>
                <span className="form-card-footer-icon">{schema.icon}</span>
                <span className="form-card-footer-label">{schema.menuLabel}</span>
                <span className="form-card-chevron">›</span>
              </div>
            </Link>
          );
        })}
      </div>
    </Shell>
  );
}
