import type { LedgerBudget } from "#sdk/types/ledger/dto/budget.ts";

/** Budget List */
export interface LedgerBudgetList {
  budgets: LedgerBudget[];
  gaps: string[];
}
