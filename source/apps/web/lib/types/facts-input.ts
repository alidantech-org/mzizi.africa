import type { FieldMeta } from "#/lib/dryv/transport.ts";

/** Facts Input */
export interface FactsInput {
  featureId?: string;
  limit?: number;
}

/** Field metadata for forms and results. */
export const FactsInputFields: readonly FieldMeta[] = [
  { name: "featureId", label: "Feature Id", kind: "string", required: false },
  { name: "limit", label: "Limit", kind: "number", required: false },
];
