import type { NonNegativeInteger } from "#/modules/shared/schema/type/non-negative-integer.type.ts";
import type { Place } from "#/modules/explorer/schema/interface/place.interface.ts";

/** Place Group */
export interface PlaceGroup {
  children: Place[];
  place: Place;
  total: NonNegativeInteger;
}
