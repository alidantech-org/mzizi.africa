/** Outlines for the map: one GeoJSON geometry per feature, read through the generated geography client. */
import {
  listFeatureGeometries,
  listFeatureGeometriesRequest,
} from "#/_archives/lib/api/geography/list-feature-geometries";

export interface Outline {
  readonly featureId: string;
  readonly geometry: GeoJSON.Geometry;
}

const cache = new Map<string, Promise<Outline | null>>();

/** The current outline of a feature, or null when none is recorded. Results are kept for the session. */
export function outlineOf(featureId: string): Promise<Outline | null> {
  const known = cache.get(featureId);
  if (known !== undefined) return known;
  const pending = listFeatureGeometries(
    listFeatureGeometriesRequest({ featureId }),
  ).then((response) => {
    const first = response.body?.geometries[0];
    return first === undefined
      ? null
      : { featureId, geometry: first.geometry as GeoJSON.Geometry };
  });
  cache.set(featureId, pending);
  return pending;
}
