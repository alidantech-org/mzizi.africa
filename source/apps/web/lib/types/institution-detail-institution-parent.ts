import type { FieldMeta } from "#/lib/dryv/transport.ts";

/** Institution Detail Institution Parent */
export interface InstitutionDetailInstitutionParent {
  code: string;
  name: string;
}

/** Field metadata for forms and results. */
export const InstitutionDetailInstitutionParentFields: readonly FieldMeta[] = [
  { name: "code", label: "Code", kind: "string", required: true },
  { name: "name", label: "Name", kind: "string", required: true },
];
