import type { NonEmptyString500 } from "#/modules/shared/schema/type/non-empty-string500.type.ts";
import type { Coalition } from "#/modules/ledger/schema/interface/coalition.interface.ts";

/** Coalition List */
export interface CoalitionList {
  coalitions: Coalition[];
  gaps: NonEmptyString500[];
}
