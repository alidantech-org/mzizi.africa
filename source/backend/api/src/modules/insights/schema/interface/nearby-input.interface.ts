import type { Latitude } from "#/modules/insights/schema/type/latitude.type.ts";
import type { Longitude } from "#/modules/insights/schema/type/longitude.type.ts";
import type { Number } from "#/modules/shared/schema/type/number.type.ts";

/** Nearby Input */
export interface NearbyInput {
  latitude: Latitude;
  longitude: Longitude;
  radiusKm?: Number;
}
