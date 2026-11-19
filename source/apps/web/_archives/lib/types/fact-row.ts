import type { FieldMeta } from "#/_archives/lib/dryv/transport";

/** Fact Row */
export interface FactRow {
  code: string;
  detail?: string | null;
  place?: string | null;
  statement: string;
  tagged: boolean;
}

/** Field metadata for forms and results. */
export const FactRowFields: readonly FieldMeta[] = [
  { name: "code", label: "Code", kind: "string", required: true },
  { name: "detail", label: "Detail", kind: "string", required: false },
  { name: "place", label: "Place", kind: "string", required: false },
  { name: "statement", label: "Statement", kind: "string", required: true },
  { name: "tagged", label: "Tagged", kind: "boolean", required: true },
];
