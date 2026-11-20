/** One change to an executed contract: a variation of price or scope, an extension, a renewal or a termination. */
export interface CivicVariations {
  amountDeltaMinorUnits?: number | null;
  code: string;
  contractId: string;
  createdAt: string;
  currencyId?: string | null;
  deletedAt?: string | null;
  id: string;
  kindId: string;
  newEndOn?: string | null;
  reason?: string | null;
  signedOn?: string | null;
  sourceCitationId?: string | null;
  updatedAt: string;
  version: number;
}
