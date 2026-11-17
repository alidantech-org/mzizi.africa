import type { Latitude } from "#/modules/geography/schema/type/latitude.type.ts";
import type { Longitude } from "#/modules/geography/schema/type/longitude.type.ts";
import type { Tolerance } from "#/modules/geography/schema/type/tolerance.type.ts";
import type { Id } from "#/modules/shared/schema/type/id.type.ts";
import type { Integer } from "#/modules/shared/schema/type/integer.type.ts";
import type { NonNegativeInteger } from "#/modules/shared/schema/type/non-negative-integer.type.ts";

/** Geometry Window */
export interface GeometryWindow {
  east: Longitude;
  featureTypeId?: Id;
  limit?: Integer;
  north: Latitude;
  offset?: Integer;
  simplifyTolerance?: Tolerance;
  south: Latitude;
  west: Longitude;
  zoom: NonNegativeInteger;
}
