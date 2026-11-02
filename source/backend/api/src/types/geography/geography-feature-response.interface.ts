import type { GeoJson } from "#/types/geography/geo-json.type.ts";
import type { Flag } from "#/types/shared/flag.type.ts";

/** Geography Feature Response */
export interface GeographyFeatureResponse {
  boundaryVerified: Flag;
  geojson: GeoJson;
}
