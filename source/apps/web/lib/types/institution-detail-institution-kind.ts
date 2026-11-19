import type { FieldMeta } from "#/lib/dryv/transport.ts";

/** Institution Detail Institution Kind */
export interface InstitutionDetailInstitutionKind {
  code: string;
  label: string;
}

/** Field metadata for forms and results. */
export const InstitutionDetailInstitutionKindFields: readonly FieldMeta[] = [
  { name: "code", label: "Code", kind: "string", required: true },
  { name: "label", label: "Label", kind: "string", required: true },
];
