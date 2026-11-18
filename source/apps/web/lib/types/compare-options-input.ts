import type { FieldMeta } from "#/lib/dryv/transport.ts";

/** Compare Options Input */
export interface CompareOptionsInput {
  featureId: string;
  metric?: string;
}

/** Field metadata for forms and results. */
export const CompareOptionsInputFields: readonly FieldMeta[] = [
  { name: "featureId", label: "Feature Id", kind: "string", required: true },
  { name: "metric", label: "Metric", kind: "string", required: false },
];
