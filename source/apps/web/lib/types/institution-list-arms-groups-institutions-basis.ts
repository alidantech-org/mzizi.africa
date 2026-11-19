import type { FieldMeta } from "#/lib/dryv/transport.ts";

/** Institution List Arms Groups Institutions Basis */
export interface InstitutionListArmsGroupsInstitutionsBasis {
  code: string;
  label: string;
}

/** Field metadata for forms and results. */
export const InstitutionListArmsGroupsInstitutionsBasisFields: readonly FieldMeta[] = [
  { name: "code", label: "Code", kind: "string", required: true },
  { name: "label", label: "Label", kind: "string", required: true },
];
