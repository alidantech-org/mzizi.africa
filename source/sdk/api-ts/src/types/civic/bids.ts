/** One supplier submission to one procurement process, with the reported amount and outcome where known. */
export interface CivicBids {
  amountMinorUnits?: number | null;
  bidderEntityId: string;
  code: string;
  createdAt: string;
  currencyId?: string | null;
  deletedAt?: string | null;
  id: string;
  outcomeId: string;
  procurementId: string;
  sourceCitationId?: string | null;
  submittedOn?: string | null;
  updatedAt: string;
  version: number;
}
