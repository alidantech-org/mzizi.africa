import type { FieldMeta } from "#/_archives/lib/dryv/transport";
import { type FactRow } from "#/_archives/lib/types/fact-row";

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
