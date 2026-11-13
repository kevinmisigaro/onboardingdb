"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  Field,
  RepeaterSubField,
  Schema,
  YesNoConditionalField,
} from "@/lib/schema";
import {
  ConditionalValue,
  FieldValue,
  FlatRow,
  FormData,
  RepeaterRow,
  computeProgress,
  exportFormToExcel,
  flattenField,
  getKlantNaam,
  loadData,
  saveData,
} from "@/lib/engine";
import { Lang, useT } from "@/lib/i18n";

function YesNo({ value, onChange }: { value: boolean | undefined; onChange: (v: boolean) => void }) {
  const { t } = useT();
  return (
    <div className="yesno-group">
      <button type="button" className={`yesno-btn${value === true ? " selected" : ""}`} onClick={() => onChange(true)}>
        {t.yes}
      </button>
      <button type="button" className={`yesno-btn${value === false ? " selected" : ""}`} onClick={() => onChange(false)}>
        {t.no}
      </button>
    </div>
  );
}

function RepeaterEditor({
  fields,
  items,
  itemLabel,
  onChange,
}: {
  fields: RepeaterSubField[];
  items: RepeaterRow[];
  itemLabel?: string;
  onChange: (rows: RepeaterRow[]) => void;
}) {
  const { t } = useT();
  function updateRow(idx: number, id: string, val: string | boolean) {
    const next = items.slice();
    next[idx] = { ...next[idx], [id]: val };
    onChange(next);
  }
  function removeRow(idx: number) {
    onChange(items.filter((_, i) => i !== idx));
  }
  function addRow() {
    const row: RepeaterRow = {};
    fields.forEach((f) => {
      row[f.id] = f.type === "yesno" ? undefined : "";
    });
    onChange([...items, row]);
  }

  return (
    <div>
      <div className="repeater-list">
        {items.map((item, idx) => (
          <div className="repeater-row" key={idx}>
            <div className="repeater-row-title">
              {itemLabel || t.defaultItemLabel} {idx + 1}
            </div>
            <button type="button" className="repeater-remove" title={t.remove} onClick={() => removeRow(idx)}>
              ✕
            </button>
            <div className="repeater-grid">
              {fields.map((sf) => (
                <div className="field" key={sf.id}>
                  <label className="field-label">{sf.label}</label>
                  {sf.type === "yesno" ? (
                    <YesNo value={item[sf.id] as boolean | undefined} onChange={(v) => updateRow(idx, sf.id, v)} />
                  ) : sf.type === "textarea" ? (
                    <textarea
                      className="input"
                      value={(item[sf.id] as string) || ""}
                      onChange={(e) => updateRow(idx, sf.id, e.target.value)}
                    />
                  ) : (
                    <input
                      className="input"
                      type={sf.type === "number" ? "number" : "text"}
                      value={(item[sf.id] as string) || ""}
                      onChange={(e) => updateRow(idx, sf.id, e.target.value)}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
      <button type="button" className="btn-add" onClick={addRow}>
        {t.addItem(itemLabel || t.defaultItemLabel)}
      </button>
    </div>
  );
}

function YesNoConditionalEditor({
  field,
  value,
  onChange,
}: {
  field: YesNoConditionalField;
  value: ConditionalValue | undefined;
  onChange: (v: ConditionalValue) => void;
}) {
  const current: ConditionalValue = value || {};
  const shouldShow = field.showOn === "yes" ? current.answer === true : current.answer === false;

  return (
    <div>
      <YesNo value={current.answer} onChange={(v) => onChange({ ...current, answer: v })} />
      {shouldShow && (
        <div className="conditional-block">
          <label className="field-label">{field.condLabel}</label>
          {field.condType === "repeater" ? (
            <RepeaterEditor
              fields={field.condFields || []}
              items={(current.cond as RepeaterRow[]) || []}
              itemLabel={field.condItemLabel}
              onChange={(rows) => onChange({ ...current, cond: rows })}
            />
          ) : field.condType === "textarea" ? (
            <textarea
              className="input"
              value={(current.cond as string) || ""}
              onChange={(e) => onChange({ ...current, cond: e.target.value })}
            />
          ) : (
            <input
              className="input"
              type="text"
              value={(current.cond as string) || ""}
              onChange={(e) => onChange({ ...current, cond: e.target.value })}
            />
          )}
        </div>
      )}
    </div>
  );
}

function Select({ options, value, onChange }: { options: string[]; value: string; onChange: (v: string) => void }) {
  const { t } = useT();
  return (
    <select className="input" value={value} onChange={(e) => onChange(e.target.value)}>
      <option value="">{t.selectPlaceholder}</option>
      {options.map((opt) => (
        <option key={opt} value={opt}>
          {opt}
        </option>
      ))}
    </select>
  );
}

function renderInput(field: Field, value: FieldValue, onChange: (v: FieldValue) => void) {
  switch (field.type) {
    case "text":
      return <input className="input" type="text" value={(value as string) || ""} onChange={(e) => onChange(e.target.value)} />;
    case "number":
      return (
        <input className="input" type="number" min={0} value={(value as string) || ""} onChange={(e) => onChange(e.target.value)} />
      );
    case "textarea":
      return <textarea className="input" value={(value as string) || ""} onChange={(e) => onChange(e.target.value)} />;
    case "date":
      return <input className="input" type="date" value={(value as string) || ""} onChange={(e) => onChange(e.target.value)} />;
    case "select":
      return <Select options={field.options} value={(value as string) || ""} onChange={(v) => onChange(v)} />;
    case "yesno":
      return <YesNo value={value as boolean | undefined} onChange={(v) => onChange(v)} />;
    case "yesno-conditional":
      return (
        <YesNoConditionalEditor field={field} value={value as ConditionalValue | undefined} onChange={(v) => onChange(v)} />
      );
    case "repeater":
      return (
        <RepeaterEditor
          fields={field.fields}
          items={(value as RepeaterRow[]) || []}
          itemLabel={field.itemLabel}
          onChange={(rows) => onChange(rows)}
        />
      );
  }
}

function FieldRow({ field, value, onChange }: { field: Field; value: FieldValue; onChange: (v: FieldValue) => void }) {
  return (
    <div className="field">
      <label className="field-label">{field.label}</label>
      {field.hint && <div className="field-hint">{field.hint}</div>}
      {renderInput(field, value, onChange)}
    </div>
  );
}

/* ---------------- Wizard: one field per page ---------------- */

interface WizardStep {
  field: Field;
  sectionIdx: number;
  sectionTitle: string;
}

function buildSteps(schema: Schema): WizardStep[] {
  const steps: WizardStep[] = [];
  schema.sections.forEach((section, sectionIdx) => {
    section.fields.forEach((field) => {
      steps.push({ field, sectionIdx, sectionTitle: section.title });
    });
  });
  return steps;
}

function ReviewPanel({
  schema,
  data,
  lang,
  stepIndexByFieldId,
  onEdit,
}: {
  schema: Schema;
  data: FormData;
  lang: Lang;
  stepIndexByFieldId: Record<string, number>;
  onEdit: (stepIndex: number) => void;
}) {
  const { t } = useT();
  return (
    <>
      <div className="card-title">{t.reviewTitle}</div>
      <div className="card-desc">{t.reviewDesc}</div>
      {schema.sections.map((section, sIdx) => (
        <div className="review-section" key={section.title}>
          <div className="review-section-title">
            <span className="section-number">{sIdx + 1}</span>
            {section.title}
          </div>
          {section.fields.map((field) => {
            const rows: FlatRow[] = [];
            flattenField(field, data[field.id], rows, lang);
            return (
              <div className="review-field" key={field.id}>
                <button
                  type="button"
                  className="review-edit-btn"
                  onClick={() => onEdit(stepIndexByFieldId[field.id])}
                >
                  {t.edit}
                </button>
                <div className="review-field-rows">
                  {rows.map((r, i) =>
                    r.type === "qa" ? (
                      <div className="review-qa" key={i}>
                        <span className="review-qa-q">{r.q}</span>
                        <span className="review-qa-a">
                          {r.a ? r.a : <em className="review-empty">{t.noAnswer}</em>}
                        </span>
                      </div>
                    ) : (
                      <div className="review-label" key={i}>
                        {r.text}
                      </div>
                    ),
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ))}
    </>
  );
}

export default function FormRenderer({
  schema,
  onProgressChange,
}: {
  schema: Schema;
  onProgressChange?: (progress: number) => void;
}) {
  // Starts empty so the server render and the client's first paint match
  // exactly; the real, localStorage-backed answers are loaded right after
  // mount, which is the one legitimate case for setting state from an effect
  // (synchronizing with an external system, per React's own guidance).
  const { lang, t } = useT();
  const [data, setData] = useState<FormData>({});
  const [savedAt, setSavedAt] = useState<number | null>(null);
  const [stepIndex, setStepIndex] = useState(0);

  const steps = useMemo(() => buildSteps(schema), [schema]);
  const totalSteps = steps.length;
  const stepIndexByFieldId = useMemo(() => {
    const map: Record<string, number> = {};
    steps.forEach((s, i) => {
      map[s.field.id] = i;
    });
    return map;
  }, [steps]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setData(loadData(schema.id));
    setStepIndex(0);
  }, [schema.id]);

  useEffect(() => {
    const timer = setTimeout(() => {
      saveData(schema.id, data);
      setSavedAt(Date.now());
      onProgressChange?.(computeProgress(schema, data));
    }, 400);
    return () => clearTimeout(timer);
  }, [data, schema, onProgressChange]);

  function update(id: string, value: FieldValue) {
    setData((prev) => ({ ...prev, [id]: value }));
  }

  function goToStep(i: number) {
    setStepIndex(Math.max(0, Math.min(i, totalSteps)));
  }

  const isReview = stepIndex >= totalSteps;
  const current = !isReview ? steps[stepIndex] : null;
  const wizardProgressPct = totalSteps === 0 ? 100 : Math.round((Math.min(stepIndex, totalSteps) / totalSteps) * 100);

  return (
    <div className="wizard">
      <div className="wizard-meta">
        <div className="wizard-meta-left">
          <span className="wizard-section-label">{isReview ? t.reviewSectionLabel : current!.sectionTitle}</span>
          <span className="wizard-step-label">
            {isReview ? t.reviewTitle : `${t.questionLabel} ${stepIndex + 1} ${t.ofLabel} ${totalSteps}`}
          </span>
        </div>
        <div className="save-indicator">
          {savedAt && (
            <>
              <span className="dot" /> {t.autoSaved}
            </>
          )}
        </div>
      </div>

      <div className="progress-track wizard-progress-track">
        <div className="progress-fill" style={{ width: `${wizardProgressPct}%` }} />
      </div>

      <div className="card wizard-card">
        {isReview ? (
          <ReviewPanel
            schema={schema}
            data={data}
            lang={lang}
            stepIndexByFieldId={stepIndexByFieldId}
            onEdit={goToStep}
          />
        ) : (
          <>
            <div className="card-title">
              <span className="section-number">{current!.sectionIdx + 1}</span>
              {current!.sectionTitle}
            </div>
            <FieldRow field={current!.field} value={data[current!.field.id]} onChange={(v) => update(current!.field.id, v)} />
          </>
        )}
      </div>

      <div className="form-footer">
        <button type="button" className="btn btn-secondary" onClick={() => goToStep(stepIndex - 1)} disabled={stepIndex === 0}>
          {t.previous}
        </button>
        <div style={{ display: "flex", gap: 10 }}>
          <Link href="/" className="btn btn-secondary">
            {t.backToOverview}
          </Link>
          {isReview ? (
            <button
              type="button"
              className="btn btn-success"
              onClick={() => exportFormToExcel(schema, data, getKlantNaam(), lang)}
            >
              {t.save}
            </button>
          ) : (
            <button type="button" className="btn btn-primary" onClick={() => goToStep(stepIndex + 1)}>
              {stepIndex === totalSteps - 1 ? t.toReview : t.next}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
