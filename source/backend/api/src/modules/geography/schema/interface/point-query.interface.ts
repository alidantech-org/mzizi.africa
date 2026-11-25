import type { Latitude } from "#/modules/geography/schema/type/latitude.type.ts";
import type { Longitude } from "#/modules/geography/schema/type/longitude.type.ts";

/** Point Query */
export interface PointQuery {
  latitude: Latitude;
  longitude: Longitude;
}
