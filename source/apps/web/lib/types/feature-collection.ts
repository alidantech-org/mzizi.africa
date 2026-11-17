import type { FieldMeta } from "#/lib/dryv/transport.ts";
import { type FeatureEntry } from "#/lib/types/feature-entry.ts";

/** Feature Collection */
export interface FeatureCollection {
  features: FeatureEntry[];
}

/** Field metadata for forms and results. */
export const FeatureCollectionFields: readonly FieldMeta[] = [
  { name: "features", label: "Features", kind: "other", required: true },
];
