import type { FieldMeta } from "#/_archives/lib/dryv/transport";

/** Content Page Related Subject */
export interface ContentPageRelatedSubject {
  code: string;
  table: string;
}

/** Field metadata for forms and results. */
export const ContentPageRelatedSubjectFields: readonly FieldMeta[] = [
  { name: "code", label: "Code", kind: "string", required: true },
  { name: "table", label: "Table", kind: "string", required: true },
];
