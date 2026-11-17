import type { FieldMeta } from "#/lib/dryv/transport.ts";
import { type FeatureGeometry } from "#/lib/types/feature-geometry.ts";

/** Feature Geometry Collection */
export interface FeatureGeometryCollection {
  geometries: FeatureGeometry[];
}

/** Field metadata for forms and results. */
export const FeatureGeometryCollectionFields: readonly FieldMeta[] = [
  { name: "geometries", label: "Geometries", kind: "other", required: true },
];
