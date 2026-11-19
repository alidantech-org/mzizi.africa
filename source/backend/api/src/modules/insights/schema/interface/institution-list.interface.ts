import type { NonEmptyString500 } from "#/modules/shared/schema/type/non-empty-string500.type.ts";
import type { NonNegativeInteger } from "#/modules/shared/schema/type/non-negative-integer.type.ts";
import type { InstitutionListArms } from "#/modules/insights/schema/interface/institution-list-arms.interface.ts";

/** Institution List */
export interface InstitutionList {
  arms: InstitutionListArms[];
  gaps: NonEmptyString500[];
  total: NonNegativeInteger;
}
