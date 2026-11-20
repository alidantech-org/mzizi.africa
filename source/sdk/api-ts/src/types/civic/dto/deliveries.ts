/** One dated deliverable or milestone under a contract, optionally scoped to a geographic unit. */
export interface CivicDeliveries {
  amountMinorUnits?: number | null;
  code: string;
  contractId: string;
  createdAt: string;
  currencyId?: string | null;
  deletedAt?: string | null;
  deliveredOn?: string | null;
  deliveryKindId: string;
  id: string;
  sourceCitationId?: string | null;
  unitFeatureId?: string | null;
  updatedAt: string;
  version: number;
}
