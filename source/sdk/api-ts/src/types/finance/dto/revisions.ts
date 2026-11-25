/** The original or a supplementary version of a budget. */
export interface FinanceRevisions {
  budgetId: string;
  code: string;
  createdAt: string;
  deletedAt?: string | null;
  id: string;
  releasedOn?: string | null;
  revision: number;
  statusTerm: string;
  updatedAt: string;
  version: number;
}
