import type { GeoJsonGeometry } from "#sdk/helpers/geojson.ts";

/** A prepared, simplified outline of a geometry for one zoom band; rebuilt when its geometry changes. */
export interface GeographyOutlines {
  band: number;
  bbox: GeoJsonGeometry;
  builtAt: string;
  centroid: GeoJsonGeometry;
  createdAt: string;
  deletedAt?: string | null;
  featureId: string;
  geometry: GeoJsonGeometry;
  geometryId: string;
  id: string;
  points: number;
  tolerance: number;
}
