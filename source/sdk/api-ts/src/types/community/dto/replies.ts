/** An official response to a post. */
export interface CommunityReplies {
  body: string;
  createdAt: string;
  deletedAt?: string | null;
  id: string;
  languageId: string;
  postCountryId: string;
  postId: string;
  publishedAt?: string | null;
  receivedAt: string;
  respondentId: string;
  statusTerm: string;
  updatedAt: string;
  version: number;
}
