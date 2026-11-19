import type { FieldMeta } from "#/_archives/lib/dryv/transport";

/** Scheme Entry */
export interface SchemeEntry {
  code: string;
  id: string;
  title: string;
}

/** Field metadata for forms and results. */
export const SchemeEntryFields: readonly FieldMeta[] = [
  { name: "code", label: "Code", kind: "string", required: true },
  { name: "id", label: "Id", kind: "string", required: true },
  { name: "title", label: "Title", kind: "string", required: true },
];
