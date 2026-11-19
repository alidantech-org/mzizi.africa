import type { NonEmptyString500 } from "#/modules/shared/schema/type/non-empty-string500.type.ts";
import type { Budget } from "#/modules/ledger/schema/interface/budget.interface.ts";

/** Budget List */
export interface BudgetList {
  budgets: Budget[];
  gaps: NonEmptyString500[];
}
