/** Feature Geometry */
export interface GeographyFeatureGeometry {
  basisId: string;
  centroid: unknown;
  confidence?: number | null;
  featureId: string;
  fromYear?: number | null;
  geometry: unknown;
  geometryId: string;
  geometryRoleId: string;
  maxZoom?: number | null;
  minZoom?: number | null;
  observedAt?: string | null;
  revision: number;
}
