import type { FieldMeta } from "#/_archives/lib/dryv/transport";
import { type InstitutionListArms } from "#/_archives/lib/types/institution-list-arms";

/** Institution List */
export interface InstitutionList {
  arms: InstitutionListArms[];
  gaps: string[];
  total: number;
}

/** Field metadata for forms and results. */
export const InstitutionListFields: readonly FieldMeta[] = [
  { name: "arms", label: "Arms", kind: "other", required: true },
  { name: "gaps", label: "Gaps", kind: "string", required: true },
  { name: "total", label: "Total", kind: "number", required: true },
];
