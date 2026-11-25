import type { Id } from "#/modules/shared/schema/type/id.type.ts";
import type { Integer } from "#/modules/shared/schema/type/integer.type.ts";

/** Observation Scope */
export interface ObservationScope {
  countryId: Id;
  featureId: Id;
  indicatorId: Id;
  limit?: Integer;
  offset?: Integer;
}
