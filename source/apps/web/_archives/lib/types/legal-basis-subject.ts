import type { FieldMeta } from "#/_archives/lib/dryv/transport";

/** Legal Basis Subject */
export interface LegalBasisSubject {
  code: string;
  table: string;
}

/** Field metadata for forms and results. */
export const LegalBasisSubjectFields: readonly FieldMeta[] = [
  { name: "code", label: "Code", kind: "string", required: true },
  { name: "table", label: "Table", kind: "string", required: true },
];
