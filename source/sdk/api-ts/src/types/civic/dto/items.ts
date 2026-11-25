/** A line item of a contract or bid. */
export interface CivicItems {
  bidId?: string | null;
  contractId?: string | null;
  createdAt: string;
  currencyId?: string | null;
  deletedAt?: string | null;
  goodId: string;
  id: string;
  quantity: number;
  unitId: string;
  unitPrice?: number | null;
  updatedAt: string;
  version: number;
}
