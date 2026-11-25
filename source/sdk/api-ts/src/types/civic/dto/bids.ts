/** A bid on a tender, including cheaper bids that lost. */
export interface CivicBids {
  amount?: number | null;
  bidderId: string;
  code: string;
  createdAt: string;
  currencyId?: string | null;
  deletedAt?: string | null;
  id: string;
  outcomeTerm: string;
  procurementId: string;
  submittedOn?: string | null;
  updatedAt: string;
  version: number;
}
