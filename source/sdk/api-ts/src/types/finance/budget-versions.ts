/** One ordered release or revision of a budget, preserving original and supplementary versions separately. */
export interface FinanceBudgetVersions {
  budgetId: string;
  createdAt: string;
  deletedAt?: string | null;
  id: string;
  releasedOn?: string | null;
  revision: number;
  sourceCitationId?: string | null;
  statusId: string;
  updatedAt: string;
  version: number;
}
