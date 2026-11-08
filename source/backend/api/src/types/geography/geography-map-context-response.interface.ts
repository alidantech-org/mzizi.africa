
import type { GeoJson } from "#/types/geography/geo-json.type.ts";

/** Geography Map Context Response */
export interface GeographyMapContextResponse {
  parentGeojson?: GeoJson | null;
  siblingsGeojson: GeoJson;
}