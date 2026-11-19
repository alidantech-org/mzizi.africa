/** A party that shares one contract or one bid with the main bidder or contractor: a joint-venture member, a subcontractor or a guarantor. */
export interface CivicPartners {
  bidId?: string | null;
  contractId?: string | null;
  createdAt: string;
  deletedAt?: string | null;
  id: string;
  partnerEntityId: string;
  roleId: string;
  sharePercentage?: number | null;
  sourceCitationId?: string | null;
  updatedAt: string;
  version: number;
}
