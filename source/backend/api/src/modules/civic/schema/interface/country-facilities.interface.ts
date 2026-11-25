import type { Id } from "#/modules/shared/schema/type/id.type.ts";
import type { Integer } from "#/modules/shared/schema/type/integer.type.ts";

/** Country Facilities */
export interface CountryFacilities {
  classTerm?: Id;
  countryId: Id;
  limit?: Integer;
  offset?: Integer;
}
