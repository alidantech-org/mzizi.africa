/** One classified amount authorized in a budget version, optionally nested and assigned to a project or unit. */
export interface FinanceAppropriations {
  amountMinorUnits: number;
  budgetVersionId: string;
  classificationId: string;
  code: string;
  createdAt: string;
  currencyId: string;
  deletedAt?: string | null;
  id: string;
  parentAppropriationId?: string | null;
  projectId?: string | null;
  recipientEntityId?: string | null;
  sourceCitationId?: string | null;
  unitFeatureId?: string | null;
  updatedAt: string;
  version: number;
}
