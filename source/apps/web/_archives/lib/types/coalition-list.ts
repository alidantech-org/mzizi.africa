import type { FieldMeta } from "#/_archives/lib/dryv/transport";
import { type Coalition } from "#/_archives/lib/types/coalition";

/** Coalition List */
export interface CoalitionList {
  coalitions: Coalition[];
  gaps: string[];
}

/** Field metadata for forms and results. */
export const CoalitionListFields: readonly FieldMeta[] = [
  { name: "coalitions", label: "Coalitions", kind: "other", required: true },
  { name: "gaps", label: "Gaps", kind: "string", required: true },
];
