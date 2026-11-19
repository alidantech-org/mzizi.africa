import type { FieldMeta } from "#/lib/dryv/transport.ts";
import { type InstitutionListArmsGroups } from "#/lib/types/institution-list-arms-groups.ts";

/** Institution List Arms */
export interface InstitutionListArms {
  about: string;
  code: string;
  count: number;
  groups: InstitutionListArmsGroups[];
  label: string;
}

/** Field metadata for forms and results. */
export const InstitutionListArmsFields: readonly FieldMeta[] = [
  { name: "about", label: "About", kind: "string", required: true },
  { name: "code", label: "Code", kind: "string", required: true },
  { name: "count", label: "Count", kind: "number", required: true },
  { name: "groups", label: "Groups", kind: "other", required: true },
  { name: "label", label: "Label", kind: "string", required: true },
];
