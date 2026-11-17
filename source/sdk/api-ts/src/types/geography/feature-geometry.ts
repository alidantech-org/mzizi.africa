/** Feature Geometry */
export interface GeographyFeatureGeometry {
  basisId: string;
  centroid: unknown;
  confidence?: number | null;
  featureId: string;
  geometry: unknown;
  geometryId: string;
  geometryRoleId: string;
  maxZoom?: number | null;
  minZoom?: number | null;
  observedAt?: string | null;
  revision: number;
  validFrom: string;
}
