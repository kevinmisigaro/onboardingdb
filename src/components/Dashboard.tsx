"use client";

import Link from "next/link";
import { DB_SCHEMAS, FORM_ORDER, FormId } from "@/lib/schema";
import { useFormProgressLive } from "@/lib/hooks";
import Shell from "@/components/Shell";

const descriptions: Record<FormId, string> = {
  reparatieonderhoud: "Inrichting van CRM, Field Service, Onderhoudsketen en financiële afhandeling voor het reparatieproces.",
  mutatieonderhoud: "Inrichting van CRM, Field Service, Onderhoudsketen, Inspectic en financiële afhandeling voor mutatieonderhoud.",
  inkoopregister: "Vastlegging van administratieve inkoop, inkooporders, declaraties en de bijbehorende audittrail.",
};

const ACCENTS: Record<FormId, "rose" | "green" | "slate"> = {
  reparatieonderhoud: "rose",
  mutatieonderhoud: "green",
  inkoopregister: "slate",
};

const BADGES: Record<FormId, string> = {
  reparatieonderhoud: "A",
  mutatieonderhoud: "B",
  inkoopregister: "C",
};

export default function Dashboard() {
  const progressReparatieonderhoud = useFormProgressLive("reparatieonderhoud");
  const progressMutatieonderhoud = useFormProgressLive("mutatieonderhoud");
  const progressInkoopregister = useFormProgressLive("inkoopregister");
  const progress: Record<FormId, number> = {
    reparatieonderhoud: progressReparatieonderhoud,
    mutatieonderhoud: progressMutatieonderhoud,
    inkoopregister: progressInkoopregister,
  };

  return (
    <Shell active="dashboard">
      <div className="hero-banner">
        <div className="hero-icon-circle">🧭</div>
        <div className="hero-content">
          <div className="hero-title">Onboarding</div>
          <div className="hero-subtitle">
            Om uw omgeving goed te kunnen inrichten hebben we een aantal inventarisaties nodig. Doorloop de
            onderstaande formulieren — uw antwoorden worden automatisch lokaal bewaard en kunnen op elk moment
            als Excel-bestand worden geëxporteerd voor verdere verwerking.
          </div>
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
        <div className="process-tree-center-drop" />
      </div>

      <div className="form-grid">
        {FORM_ORDER.map((id) => {
          const schema = DB_SCHEMAS[id];
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
                <span>{pct}% ingevuld</span>
                <span>{pct >= 100 ? "✓ Klaar" : "Doorgaan →"}</span>
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
