"use client";

import Link from "next/link";
import { useState } from "react";
import { DB_SCHEMAS, FormId } from "@/lib/schema";
import Shell from "@/components/Shell";
import FormRenderer from "@/components/FormRenderer";

export default function FormPage({ formId }: { formId: FormId }) {
  const schema = DB_SCHEMAS[formId];
  // undefined until FormRenderer reports a real value, so Shell falls back to
  // its own (hydration-safe) progress reading in the meantime.
  const [progress, setProgress] = useState<number | undefined>(undefined);

  return (
    <Shell active={formId} progressOverride={progress}>
      <div className="page-header">
        <div className="breadcrumb">
          <Link href="/">Overzicht</Link> &nbsp;/&nbsp; {schema.menuLabel}
        </div>
        <div className="page-title">{schema.title}</div>
        <div className="page-subtitle">{schema.intro}</div>
      </div>

      {schema.infoBox && (
        <div className="info-box">
          {schema.infoBox.split("\n\n").map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </div>
      )}

      <FormRenderer schema={schema} onProgressChange={setProgress} />
    </Shell>
  );
}
