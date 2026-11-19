import type { FieldMeta } from "#/_archives/lib/dryv/transport";
import { type FeatureEntry } from "#/_archives/lib/types/feature-entry";

/** Feature Collection */
export interface FeatureCollection {
  features: FeatureEntry[];
}

/** Field metadata for forms and results. */
export const FeatureCollectionFields: readonly FieldMeta[] = [
  { name: "features", label: "Features", kind: "other", required: true },
];
