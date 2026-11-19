import type { FieldMeta } from "#/lib/dryv/transport.ts";
import { type Coalition } from "#/lib/types/coalition.ts";

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
