import type { Count } from "#/modules/ledger/schema/type/count.type.ts";
import type { NonEmptyString500 } from "#/modules/shared/schema/type/non-empty-string500.type.ts";
import type { Fund } from "#/modules/ledger/schema/interface/fund.interface.ts";

/** Fund List */
export interface FundList {
  funds: Fund[];
  gaps: NonEmptyString500[];
  total: Count;
}
