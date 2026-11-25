/** A named thing an actor follows. */
export interface CommunitySubscriptions {
  actorId: string;
  createdAt: string;
  deletedAt?: string | null;
  id: string;
  identityId: string;
  kindTerm: string;
  revokedAt?: string | null;
  updatedAt: string;
  version: number;
}
