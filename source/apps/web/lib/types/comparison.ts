import type { FieldMeta } from "#/lib/dryv/transport.ts";

/** Comparison */
export interface Comparison {
  a: unknown;
  b: unknown;
  gaps: string[];
  rows: unknown[];
}

/** Field metadata for forms and results. */
export const ComparisonFields: readonly FieldMeta[] = [
  { name: "a", label: "A", kind: "other", required: true },
  { name: "b", label: "B", kind: "other", required: true },
  { name: "gaps", label: "Gaps", kind: "string", required: true },
  { name: "rows", label: "Rows", kind: "other", required: true },
];
