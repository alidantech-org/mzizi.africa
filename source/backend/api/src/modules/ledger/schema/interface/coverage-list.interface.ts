import type { NonEmptyString500 } from "#/modules/shared/schema/type/non-empty-string500.type.ts";
import type { CoverageItem } from "#/modules/ledger/schema/interface/coverage-item.interface.ts";

/** Coverage List */
export interface CoverageList {
  gaps: NonEmptyString500[];
  items: CoverageItem[];
}
