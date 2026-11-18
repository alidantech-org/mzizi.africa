/** One reported financial flow at its source transaction grain, not a rolled-up aggregate. */
export interface FinanceFlows {
  amountMinorUnits: number;
  appropriationId?: string | null;
  code: string;
  contractId?: string | null;
  counterpartyEntityId?: string | null;
  createdAt: string;
  currencyId: string;
  debtId?: string | null;
  deletedAt?: string | null;
  expenditureClassId?: string | null;
  fiscalPeriodId?: string | null;
  flowKindId: string;
  fundId?: string | null;
  id: string;
  institutionId?: string | null;
  occurredOn: string;
  projectId?: string | null;
  scopeUnitFeatureId?: string | null;
  sourceCitationId?: string | null;
  updatedAt: string;
  version: number;
}
