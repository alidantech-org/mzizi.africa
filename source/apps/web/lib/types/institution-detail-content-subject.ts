import type { FieldMeta } from "#/lib/dryv/transport.ts";

/** Institution Detail Content Subject */
export interface InstitutionDetailContentSubject {
  code: string;
  table: string;
}

/** Field metadata for forms and results. */
export const InstitutionDetailContentSubjectFields: readonly FieldMeta[] = [
  { name: "code", label: "Code", kind: "string", required: true },
  { name: "table", label: "Table", kind: "string", required: true },
];
