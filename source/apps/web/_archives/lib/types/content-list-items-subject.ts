import type { FieldMeta } from "#/_archives/lib/dryv/transport";

/** Content List Items Subject */
export interface ContentListItemsSubject {
  code?: string | null;
  table: string;
}

/** Field metadata for forms and results. */
export const ContentListItemsSubjectFields: readonly FieldMeta[] = [
  { name: "code", label: "Code", kind: "string", required: false },
  { name: "table", label: "Table", kind: "string", required: true },
];
