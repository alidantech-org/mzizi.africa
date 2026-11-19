import type { FieldMeta } from "#/lib/dryv/transport.ts";

/** Content Page Content Subject */
export interface ContentPageContentSubject {
  code: string;
  table: string;
}

/** Field metadata for forms and results. */
export const ContentPageContentSubjectFields: readonly FieldMeta[] = [
  { name: "code", label: "Code", kind: "string", required: true },
  { name: "table", label: "Table", kind: "string", required: true },
];
