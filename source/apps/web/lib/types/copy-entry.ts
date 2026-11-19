import type { FieldMeta } from "#/lib/dryv/transport.ts";

/** Copy Entry */
export interface CopyEntry {
  key: string;
  text: string;
}

/** Field metadata for forms and results. */
export const CopyEntryFields: readonly FieldMeta[] = [
  { name: "key", label: "Key", kind: "string", required: true },
  { name: "text", label: "Text", kind: "string", required: true },
];
