/** Work delivered and certified under a contract. */
export interface CivicDeliveries {
  amount?: number | null;
  code: string;
  contractId: string;
  createdAt: string;
  currencyId?: string | null;
  deletedAt?: string | null;
  deliveredOn?: string | null;
  featureId?: string | null;
  id: string;
  kindTerm: string;
  updatedAt: string;
  version: number;
}
