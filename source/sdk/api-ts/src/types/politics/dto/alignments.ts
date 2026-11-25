/** A party's dated place in a coalition. */
export interface PoliticsAlignments {
  coalitionId: string;
  createdAt: string;
  deletedAt?: string | null;
  fromYear?: number | null;
  id: string;
  kindTerm: string;
  partyId: string;
  toYear?: number | null;
  updatedAt: string;
  version: number;
}
