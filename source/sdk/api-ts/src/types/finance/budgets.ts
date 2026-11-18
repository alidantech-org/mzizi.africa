/** One institutional/country budget identity for a fiscal period and budget classification. */
export interface FinanceBudgets {
  budgetKindId: string;
  code: string;
  countryId?: string | null;
  createdAt: string;
  deletedAt?: string | null;
  fiscalPeriodId: string;
  governmentEntityId?: string | null;
  id: string;
  sourceCitationId?: string | null;
  updatedAt: string;
  version: number;
}
