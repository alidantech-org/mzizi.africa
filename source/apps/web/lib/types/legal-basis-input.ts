import type { FieldMeta } from "#/lib/dryv/transport.ts";

/** Legal Basis Input */
export interface LegalBasisInput {
  subjectCode: string;
  subjectTable: string;
}

/** Field metadata for forms and results. */
export const LegalBasisInputFields: readonly FieldMeta[] = [
  { name: "subjectCode", label: "Subject Code", kind: "string", required: true },
  { name: "subjectTable", label: "Subject Table", kind: "string", required: true },
];
