import type { GeoJsonGeometry } from "#sdk/helpers/geojson.ts";

/** Subdivided polygons with a spatial index, so "where am I?" lookups stay fast even for long coastlines. */
export interface GeographyPieces {
  createdAt: string;
  deletedAt?: string | null;
  featureId: string;
  geometry: GeoJsonGeometry;
  geometryId: string;
  id: string;
}
