/** A government's budget for a fiscal period. */
export interface FinanceBudgets {
  code: string;
  countryId: string;
  createdAt: string;
  deletedAt?: string | null;
  governmentId: string;
  id: string;
  kindTerm: string;
  periodId: string;
  updatedAt: string;
  version: number;
}
