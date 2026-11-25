/** A member's reaction to a post, named thing or article. */
export interface CommunityReactions {
  actorId: string;
  articleId?: string | null;
  createdAt: string;
  deletedAt?: string | null;
  id: string;
  identityId?: string | null;
  kindTerm: string;
  postCountryId?: string | null;
  postId?: string | null;
  updatedAt: string;
  version: number;
}
