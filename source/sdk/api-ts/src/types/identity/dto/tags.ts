/** Loose editorial labels on named things, for related links and collections. */
export interface IdentityTags {
  createdAt: string;
  deletedAt?: string | null;
  id: string;
  identityId: string;
  tagTerm: string;
}
