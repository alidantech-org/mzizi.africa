import type { Limit } from "#/modules/explorer/schema/type/limit.type.ts";
import type { NonEmptyString500 } from "#/modules/shared/schema/type/non-empty-string500.type.ts";
import type { NonNegativeInteger } from "#/modules/shared/schema/type/non-negative-integer.type.ts";
import type { PositiveInteger } from "#/modules/shared/schema/type/positive-integer.type.ts";
import type { Place } from "#/modules/explorer/schema/interface/place.interface.ts";

/** Places */
export interface Places {
  gaps: NonEmptyString500[];
  limit: Limit;
  page: PositiveInteger;
  places: Place[];
  total: NonNegativeInteger;
}
