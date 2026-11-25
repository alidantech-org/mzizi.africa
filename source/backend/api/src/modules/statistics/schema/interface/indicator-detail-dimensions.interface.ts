import type { Flag } from "#/modules/shared/schema/type/flag.type.ts";
import type { Id } from "#/modules/shared/schema/type/id.type.ts";
import type { NonNegativeInteger } from "#/modules/shared/schema/type/non-negative-integer.type.ts";

/** Indicator Detail Dimensions */
export interface IndicatorDetailDimensions {
  isRequired: Flag;
  position: NonNegativeInteger;
  schemeId: Id;
}
