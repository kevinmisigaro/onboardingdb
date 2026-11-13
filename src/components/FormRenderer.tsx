"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  Field,
  RepeaterSubField,
  Schema,
  YesNoConditionalField,
} from "@/lib/schema";
import {
  ConditionalValue,
  FieldValue,
  FormData,
  RepeaterRow,
  computeProgress,
  exportFormToExcel,
  getKlantNaam,
  loadData,
  saveData,
} from "@/lib/engine";
import { useT } from "@/lib/i18n";

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

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setData(loadData(schema.id));
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

  return (
    <>
      {schema.sections.map((section, sIdx) => (
        <div className="card" key={section.title}>
          <div className="card-title">
            <span className="section-number">{sIdx + 1}</span>
            {section.title}
          </div>
          {section.fields.map((field) => (
            <FieldRow key={field.id} field={field} value={data[field.id]} onChange={(v) => update(field.id, v)} />
          ))}
        </div>
      ))}

      <div className="form-footer">
        <div className="save-indicator">
          {savedAt && (
            <>
              <span className="dot" /> {t.autoSaved}
            </>
          )}
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          <Link href="/" className="btn btn-secondary">
            {t.backToOverview}
          </Link>
          <button
            type="button"
            className="btn btn-success"
            onClick={() => exportFormToExcel(schema, data, getKlantNaam(), lang)}
          >
            {t.save}
          </button>
        </div>
      </div>
    </>
  );
}
