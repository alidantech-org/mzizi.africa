import type { FieldMeta } from "#/_archives/lib/dryv/transport";

/** Feature Key */
export interface FeatureKey {
  featureId: string;
}

/** Field metadata for forms and results. */
export const FeatureKeyFields: readonly FieldMeta[] = [
  { name: "featureId", label: "Feature Id", kind: "string", required: true },
];
