import type { FieldMeta } from "#/lib/dryv/transport.ts";

/** Feature Key */
export interface FeatureKey {
  featureId: string;
}

/** Field metadata for forms and results. */
export const FeatureKeyFields: readonly FieldMeta[] = [
  { name: "featureId", label: "Feature Id", kind: "string", required: true },
];
