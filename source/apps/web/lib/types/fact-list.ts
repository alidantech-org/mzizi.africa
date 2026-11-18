import type { FieldMeta } from "#/lib/dryv/transport.ts";
import { type FactRow } from "#/lib/types/fact-row.ts";

/** Fact List */
export interface FactList {
  facts: FactRow[];
  gaps: string[];
}

/** Field metadata for forms and results. */
export const FactListFields: readonly FieldMeta[] = [
  { name: "facts", label: "Facts", kind: "other", required: true },
  { name: "gaps", label: "Gaps", kind: "string", required: true },
];
