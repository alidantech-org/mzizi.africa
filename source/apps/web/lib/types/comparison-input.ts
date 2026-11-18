import type { FieldMeta } from "#/lib/dryv/transport.ts";

/** Comparison Input */
export interface ComparisonInput {
  a: string;
  b: string;
  metrics?: string;
}

/** Field metadata for forms and results. */
export const ComparisonInputFields: readonly FieldMeta[] = [
  { name: "a", label: "A", kind: "string", required: true },
  { name: "b", label: "B", kind: "string", required: true },
  { name: "metrics", label: "Metrics", kind: "string", required: false },
];
