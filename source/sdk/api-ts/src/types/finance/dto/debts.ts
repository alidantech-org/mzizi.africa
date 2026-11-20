/** One public debt instrument between a borrower and optional lender, with contracted amount and maturity facts. */
export interface FinanceDebts {
  amountMinorUnits: number;
  borrowerEntityId: string;
  code: string;
  contractedOn?: string | null;
  countryId?: string | null;
  createdAt: string;
  currencyId: string;
  debtKindId: string;
  deletedAt?: string | null;
  id: string;
  lenderEntityId?: string | null;
  maturityOn?: string | null;
  sourceCitationId?: string | null;
  updatedAt: string;
  version: number;
}
