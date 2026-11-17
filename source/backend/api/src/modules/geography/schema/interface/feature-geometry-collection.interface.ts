import type { FeatureGeometry } from "#/modules/geography/schema/interface/feature-geometry.interface.ts";

/** Feature Geometry Collection */
export interface FeatureGeometryCollection {
  geometries: FeatureGeometry[];
}
