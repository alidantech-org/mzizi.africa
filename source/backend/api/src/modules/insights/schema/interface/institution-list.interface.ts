import type { NonEmptyString500 } from "#/modules/shared/schema/type/non-empty-string500.type.ts";
import type { NonNegativeInteger } from "#/modules/shared/schema/type/non-negative-integer.type.ts";

/** Institution List */
export interface InstitutionList {
  arms: Record<string, unknown>[];
  gaps: NonEmptyString500[];
  total: NonNegativeInteger;
}
