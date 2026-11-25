import type { Id } from "#/modules/shared/schema/type/id.type.ts";
import type { Integer } from "#/modules/shared/schema/type/integer.type.ts";

/** Place Tallies */
export interface PlaceTallies {
  contestId?: Id;
  countryId: Id;
  featureId: Id;
  limit?: Integer;
  offset?: Integer;
}
