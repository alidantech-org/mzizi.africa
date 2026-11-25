import type { FinanceBudgetEntryRevisions } from "#sdk/types/finance/dto/budget-entry-revisions.ts";

/** Budget Entry */
export interface FinanceBudgetEntry {
  budgetId: string;
  code: string;
  endsOn: string;
  kindTerm: string;
  periodCode: string;
  periodId: string;
  revisions: FinanceBudgetEntryRevisions[];
  startsOn: string;
}
