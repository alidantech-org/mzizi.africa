/** One drawing of a feature: a revision with a role, a basis, a confidence, a zoom range, a validity period and the stored file it came from. A feature has many; the current one has no end date. */
export interface GeographyGeometries {
  area: number;
  basisId: string;
  centroid: unknown;
  confidence?: number | null;
  createdAt: string;
  deletedAt?: string | null;
  envelope: unknown;
  featureId: string;
  fileVersionRefId?: string | null;
  geometry: unknown;
  geometryRoleId: string;
  id: string;
  maxZoom?: number | null;
  minZoom?: number | null;
  observedAt?: string | null;
  revision: number;
  srid: number;
  supersedesId?: string | null;
  updatedAt: string;
  validFrom?: string | null;
  validFromEarliest?: string | null;
  validFromLatest?: string | null;
  validUntil?: string | null;
  validUntilEarliest?: string | null;
  validUntilLatest?: string | null;
  version: number;
}
