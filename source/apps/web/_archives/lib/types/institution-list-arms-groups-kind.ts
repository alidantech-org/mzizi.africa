import type { FieldMeta } from "#/_archives/lib/dryv/transport";

/** Institution List Arms Groups Kind */
export interface InstitutionListArmsGroupsKind {
  code: string;
  label: string;
}

/** Field metadata for forms and results. */
export const InstitutionListArmsGroupsKindFields: readonly FieldMeta[] = [
  { name: "code", label: "Code", kind: "string", required: true },
  { name: "label", label: "Label", kind: "string", required: true },
];
