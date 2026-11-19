import type { FieldMeta } from "#/_archives/lib/dryv/transport";
import { type FeatureGeometry } from "#/_archives/lib/types/feature-geometry";

/** Feature Geometry Collection */
export interface FeatureGeometryCollection {
  geometries: FeatureGeometry[];
}

/** Field metadata for forms and results. */
export const FeatureGeometryCollectionFields: readonly FieldMeta[] = [
  { name: "geometries", label: "Geometries", kind: "other", required: true },
];
