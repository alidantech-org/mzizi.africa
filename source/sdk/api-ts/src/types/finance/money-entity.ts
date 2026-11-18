/** Base for records that carry an amount in minor units and its currency. */
export interface FinanceMoneyEntity {
  amountMinorUnits: number;
  code: string;
  createdAt: string;
  currencyId: string;
  deletedAt?: string | null;
  id: string;
  updatedAt: string;
  version: number;
}
