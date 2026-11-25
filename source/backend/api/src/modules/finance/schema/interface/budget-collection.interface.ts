import type { BudgetEntry } from "#/modules/finance/schema/interface/budget-entry.interface.ts";

/** Budget Collection */
export interface BudgetCollection {
  budgets: BudgetEntry[];
}
