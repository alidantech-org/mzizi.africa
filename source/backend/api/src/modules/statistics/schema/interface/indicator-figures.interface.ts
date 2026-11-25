import type { Id } from "#/modules/shared/schema/type/id.type.ts";
import type { Integer } from "#/modules/shared/schema/type/integer.type.ts";
import type { Year } from "#/modules/shared/schema/type/year.type.ts";

/** Indicator Figures */
export interface IndicatorFigures {
  countryId: Id;
  fromYear?: Year;
  indicatorId: Id;
  limit?: Integer;
  offset?: Integer;
}
