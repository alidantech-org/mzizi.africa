import type { GeographyFeatureGeometry } from "#sdk/types/geography/feature-geometry.ts";

/** Feature Geometry Collection */
export interface GeographyFeatureGeometryCollection {
  geometries: GeographyFeatureGeometry[];
}
