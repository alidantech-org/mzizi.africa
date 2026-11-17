/** One directed typed relationship between exactly two Official identities, optionally with an ownership share. */
export interface OfficialRelationships {
  createdAt: string;
  deletedAt?: string | null;
  fromEntityId?: string | null;
  fromIndividualId?: string | null;
  id: string;
  kindId: string;
  sharePercentage?: number | null;
  sourceCitationId?: string | null;
  toEntityId?: string | null;
  toIndividualId?: string | null;
  updatedAt: string;
  validFrom?: string | null;
  validUntil?: string | null;
  version: number;
}
