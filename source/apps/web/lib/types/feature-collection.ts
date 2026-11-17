import type { FieldMeta } from "../dryv/transport.ts";
import { type FeatureEntry } from "./feature-entry.ts";

/** Feature Collection */
export interface FeatureCollection {
  features: FeatureEntry[];
}

/** Field metadata for forms and results. */
export const FeatureCollectionFields: readonly FieldMeta[] = [
  { name: "features", label: "Features", kind: "other", required: true },
];
