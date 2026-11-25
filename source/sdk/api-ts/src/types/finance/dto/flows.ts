/** A movement of public money: allocation, transfer, disbursement, payment or receipt. */
export interface FinanceFlows {
  amount?: number | null;
  appropriationId?: string | null;
  classTerm?: string | null;
  contractId?: string | null;
  counterpartyId?: string | null;
  countryId: string;
  createdAt: string;
  currencyId?: string | null;
  debtId?: string | null;
  deletedAt?: string | null;
  featureId?: string | null;
  fundId?: string | null;
  id: string;
  institutionId?: string | null;
  kindTerm: string;
  occurredOn?: string | null;
  periodId?: string | null;
  projectId?: string | null;
  updatedAt: string;
  version: number;
}
