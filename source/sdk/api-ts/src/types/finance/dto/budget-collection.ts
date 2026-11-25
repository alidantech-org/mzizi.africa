import type { FinanceBudgetEntry } from "#sdk/types/finance/dto/budget-entry.ts";

/** Budget Collection */
export interface FinanceBudgetCollection {
  budgets: FinanceBudgetEntry[];
}
