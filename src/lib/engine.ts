import * as XLSX from "xlsx";
import { Field, FormId, Schema } from "./schema";

/* ---------------- Data shape ---------------- */

export type RepeaterRow = Record<string, string | boolean | undefined>;

export interface ConditionalValue {
  answer?: boolean;
  cond?: string | RepeaterRow[];
}

export type FieldValue = string | boolean | RepeaterRow[] | ConditionalValue | undefined;

export type FormData = Record<string, FieldValue>;

/* ---------------- localStorage persistence ---------------- */

function storageKey(formId: FormId) {
  return `db_data_${formId}`;
}

export function loadData(formId: FormId): FormData {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.localStorage.getItem(storageKey(formId));
    return raw ? (JSON.parse(raw) as FormData) : {};
  } catch {
    return {};
  }
}

export function saveData(formId: FormId, data: FormData) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(storageKey(formId), JSON.stringify(data));
  } catch {
    /* ignore quota / privacy-mode errors */
  }
}

const KLANT_KEY = "db_klant_naam";

export function getKlantNaam(): string {
  if (typeof window === "undefined") return "";
  return window.localStorage.getItem(KLANT_KEY) || "";
}

export function setKlantNaam(name: string) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(KLANT_KEY, name);
}

/* ---------------- Flatten schema+data into Q&A rows (progress + export) ---------------- */

type FlatRow =
  | { type: "section"; text: string }
  | { type: "label"; text: string }
  | { type: "subheader"; text: string }
  | { type: "qa"; q: string; a: string };

function yesnoText(v: unknown): string {
  return v === true ? "Ja" : v === false ? "Nee" : "";
}

function flattenRepeaterItem(fields: { id: string; type: string; label: string }[], item: RepeaterRow | undefined, rows: FlatRow[]) {
  fields.forEach((sf) => {
    const raw = item ? item[sf.id] : undefined;
    const answer = sf.type === "yesno" ? yesnoText(raw) : raw ? String(raw) : "";
    rows.push({ type: "qa", q: sf.label, a: answer });
  });
}

function flattenField(field: Field, value: FieldValue, rows: FlatRow[]) {
  switch (field.type) {
    case "text":
    case "number":
    case "textarea":
      rows.push({ type: "qa", q: field.label, a: value ? String(value) : "" });
      break;
    case "select":
      rows.push({ type: "qa", q: field.label, a: (value as string) || "" });
      break;
    case "yesno":
      rows.push({ type: "qa", q: field.label, a: yesnoText(value) });
      break;
    case "yesno-conditional": {
      const v = (value as ConditionalValue) || {};
      rows.push({ type: "qa", q: field.label, a: yesnoText(v.answer) });
      const shouldShow = field.showOn === "yes" ? v.answer === true : v.answer === false;
      if (shouldShow) {
        if (field.condType === "repeater") {
          rows.push({ type: "label", text: `↳ ${field.condLabel}` });
          ((v.cond as RepeaterRow[]) || []).forEach((item, idx) => {
            rows.push({ type: "subheader", text: `${field.condItemLabel || "Item"} ${idx + 1}` });
            flattenRepeaterItem(field.condFields || [], item, rows);
          });
        } else {
          rows.push({ type: "qa", q: `↳ ${field.condLabel}`, a: (v.cond as string) || "" });
        }
      }
      break;
    }
    case "repeater": {
      rows.push({ type: "label", text: field.label });
      ((value as RepeaterRow[]) || []).forEach((item, idx) => {
        rows.push({ type: "subheader", text: `${field.itemLabel || "Item"} ${idx + 1}` });
        flattenRepeaterItem(field.fields, item, rows);
      });
      break;
    }
  }
}

export function flattenForm(schema: Schema, data: FormData): FlatRow[] {
  const rows: FlatRow[] = [];
  schema.sections.forEach((section) => {
    rows.push({ type: "section", text: section.title });
    section.fields.forEach((f) => flattenField(f, data[f.id], rows));
  });
  return rows;
}

export function computeProgress(schema: Schema, data: FormData): number {
  const rows = flattenForm(schema, data);
  const qa = rows.filter((r) => r.type === "qa") as { type: "qa"; q: string; a: string }[];
  if (qa.length === 0) return 0;
  const answered = qa.filter((r) => r.a && r.a.trim().length > 0).length;
  return Math.round((answered / qa.length) * 100);
}

/* ---------------- Excel export ---------------- */

function sheetRowsFor(schema: Schema, data: FormData): (string | undefined)[][] {
  const rows = flattenForm(schema, data);
  const sheetRows: (string | undefined)[][] = [["Vraag", "Antwoord"]];
  rows.forEach((r) => {
    if (r.type === "section") sheetRows.push([`▸ ${r.text.toUpperCase()}`, ""]);
    else if (r.type === "label") sheetRows.push([r.text, ""]);
    else if (r.type === "subheader") sheetRows.push([`   ${r.text}`, ""]);
    else sheetRows.push([r.q, r.a]);
  });
  return sheetRows;
}

function safeFileName(name: string) {
  return (name || "Klant").replace(/[^a-z0-9]+/gi, "_");
}

export function exportFormToExcel(schema: Schema, data: FormData, klantNaam: string) {
  const ws = XLSX.utils.aoa_to_sheet(sheetRowsFor(schema, data));
  ws["!cols"] = [{ wch: 70 }, { wch: 60 }];
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, schema.menuLabel.slice(0, 31));
  const date = new Date().toISOString().slice(0, 10);
  XLSX.writeFile(wb, `DataBalk_${schema.menuLabel}_${safeFileName(klantNaam)}_${date}.xlsx`);
}

export function exportAllToExcel(schemas: Schema[], klantNaam: string) {
  const wb = XLSX.utils.book_new();
  schemas.forEach((schema) => {
    const data = loadData(schema.id);
    const ws = XLSX.utils.aoa_to_sheet(sheetRowsFor(schema, data));
    ws["!cols"] = [{ wch: 70 }, { wch: 60 }];
    XLSX.utils.book_append_sheet(wb, ws, schema.menuLabel.slice(0, 31));
  });
  const date = new Date().toISOString().slice(0, 10);
  XLSX.writeFile(wb, `DataBalk_Onboarding_${safeFileName(klantNaam)}_${date}.xlsx`);
}
