import type { FieldMeta } from "#/lib/dryv/transport.ts";

/** Coverage Item */
export interface CoverageItem {
  checkedOn?: string | null;
  code: string;
  expectedAt?: string | null;
  level?: string | null;
  note?: string | null;
  source?: string | null;
  subject: string;
}

/** Field metadata for forms and results. */
export const CoverageItemFields: readonly FieldMeta[] = [
  { name: "checkedOn", label: "Checked On", kind: "string", required: false },
  { name: "code", label: "Code", kind: "string", required: true },
  { name: "expectedAt", label: "Expected At", kind: "string", required: false },
  { name: "level", label: "Level", kind: "string", required: false },
  { name: "note", label: "Note", kind: "string", required: false },
  { name: "source", label: "Source", kind: "string", required: false },
  { name: "subject", label: "Subject", kind: "string", required: true },
];
