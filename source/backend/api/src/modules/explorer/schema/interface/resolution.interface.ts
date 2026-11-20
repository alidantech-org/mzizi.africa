import type { ResolutionStatus } from "#/modules/explorer/schema/enum/resolution-status.enum.ts";
import type { NonEmptyString500 } from "#/modules/shared/schema/type/non-empty-string500.type.ts";
import type { Place } from "#/modules/explorer/schema/interface/place.interface.ts";

/** Resolution */
export interface Resolution {
  candidates: Place[];
  gaps: NonEmptyString500[];
  status: ResolutionStatus;
}
