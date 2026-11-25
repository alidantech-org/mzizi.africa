/** A line of a budget revision: money voted to a recipient, programme, project or place. */
export interface FinanceAppropriations {
  amount?: number | null;
  classTerm: string;
  code: string;
  createdAt: string;
  currencyId?: string | null;
  deletedAt?: string | null;
  featureId?: string | null;
  id: string;
  parentId?: string | null;
  projectId?: string | null;
  recipientId?: string | null;
  revisionId: string;
  updatedAt: string;
  version: number;
}
