import { useSyncExternalStore } from "react";
import { DB_SCHEMAS, FormId } from "./schema";
import { computeProgress, getKlantNaam, loadData } from "./engine";

/* Read-only snapshots of localStorage-backed state, kept hydration-safe via
   useSyncExternalStore: the server (and the client's first paint) always see
   the deterministic default, and React re-renders with the real value right
   after hydration completes — no manual effect/setState dance needed. */

const noopSubscribe = () => () => {};

export function useKlantNaamLive(): string {
  return useSyncExternalStore(noopSubscribe, () => getKlantNaam(), () => "");
}

export function useFormProgressLive(formId: FormId): number {
  return useSyncExternalStore(
    noopSubscribe,
    () => computeProgress(DB_SCHEMAS[formId], loadData(formId)),
    () => 0,
  );
}
