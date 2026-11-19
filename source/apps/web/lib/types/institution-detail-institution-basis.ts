import type { FieldMeta } from "#/lib/dryv/transport.ts";

/** Institution Detail Institution Basis */
export interface InstitutionDetailInstitutionBasis {
  code: string;
  label: string;
}

/** Field metadata for forms and results. */
export const InstitutionDetailInstitutionBasisFields: readonly FieldMeta[] = [
  { name: "code", label: "Code", kind: "string", required: true },
  { name: "label", label: "Label", kind: "string", required: true },
];
