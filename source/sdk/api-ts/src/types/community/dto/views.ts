/** A counted view, kept for a limited time. */
export interface CommunityViews {
  articleId?: string | null;
  countryId?: string | null;
  createdAt: string;
  day: string;
  id: string;
  identityId?: string | null;
  postCountryId?: string | null;
  postId?: string | null;
  visitorHash: string;
}
