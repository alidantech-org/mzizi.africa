import type { FieldMeta } from "#/lib/dryv/transport.ts";
import { type ComparisonA } from "#/lib/types/comparison-a.ts";
import { type ComparisonB } from "#/lib/types/comparison-b.ts";
import { type ComparisonRows } from "#/lib/types/comparison-rows.ts";

/** Comparison */
export interface Comparison {
  a: ComparisonA;
  b: ComparisonB;
  gaps: string[];
  rows: ComparisonRows[];
}

/** Field metadata for forms and results. */
export const ComparisonFields: readonly FieldMeta[] = [
  { name: "a", label: "A", kind: "other", required: true },
  { name: "b", label: "B", kind: "other", required: true },
  { name: "gaps", label: "Gaps", kind: "string", required: true },
  { name: "rows", label: "Rows", kind: "other", required: true },
];
