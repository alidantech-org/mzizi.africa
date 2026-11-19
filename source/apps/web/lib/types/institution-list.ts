import type { FieldMeta } from "#/lib/dryv/transport.ts";
import { type InstitutionListArms } from "#/lib/types/institution-list-arms.ts";

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
