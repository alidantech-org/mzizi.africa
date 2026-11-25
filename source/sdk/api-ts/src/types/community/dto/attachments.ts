/** Media attached to a post; reviewed with the post. */
export interface CommunityAttachments {
  assetId: string;
  createdAt: string;
  deletedAt?: string | null;
  id: string;
  postCountryId: string;
  postId: string;
}
