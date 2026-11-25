/** A consent an actor gave or withdrew, with the exact text version. */
export interface CommunityConsents {
  actorId: string;
  countryId?: string | null;
  createdAt: string;
  deletedAt?: string | null;
  givenAt: string;
  id: string;
  keyId: string;
  purposeTerm: string;
  textVersion: string;
  updatedAt: string;
  version: number;
  withdrawnAt?: string | null;
}
