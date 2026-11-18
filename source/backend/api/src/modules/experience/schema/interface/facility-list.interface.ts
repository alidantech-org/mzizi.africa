import type { NonEmptyString500 } from "#/modules/shared/schema/type/non-empty-string500.type.ts";
import type { NonNegativeInteger } from "#/modules/shared/schema/type/non-negative-integer.type.ts";
import type { ClassCount } from "#/modules/experience/schema/interface/class-count.interface.ts";
import type { FacilityRow } from "#/modules/experience/schema/interface/facility-row.interface.ts";

/** Facility List */
export interface FacilityList {
  classes: ClassCount[];
  facilities: FacilityRow[];
  gaps: NonEmptyString500[];
  total: NonNegativeInteger;
}
