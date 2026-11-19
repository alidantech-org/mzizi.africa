import type { FieldMeta } from "#/_archives/lib/dryv/transport";
import { type ComparisonA } from "#/_archives/lib/types/comparison-a";
import { type ComparisonB } from "#/_archives/lib/types/comparison-b";
import { type ComparisonRows } from "#/_archives/lib/types/comparison-rows";

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
