import type { GeographyFeatureGeometry } from "#sdk/types/geography/dto/feature-geometry.ts";

/** Feature Geometry Collection */
export interface GeographyFeatureGeometryCollection {
  geometries: GeographyFeatureGeometry[];
}
