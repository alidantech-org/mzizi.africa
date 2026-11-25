import type { GeoJsonGeometry } from "#sdk/helpers/geojson.ts";

/** One full-detail drawing of a feature with its role, basis and revision. The current drawing has no end year. */
export interface GeographyGeometries {
  area: number;
  basisTerm: string;
  centroid: GeoJsonGeometry;
  confidence?: number | null;
  createdAt: string;
  deletedAt?: string | null;
  envelope: GeoJsonGeometry;
  featureId: string;
  fromYear?: number | null;
  geometry: GeoJsonGeometry;
  id: string;
  revision: number;
  roleTerm: string;
  supersedesId?: string | null;
  toYear?: number | null;
  updatedAt: string;
  version: number;
}
