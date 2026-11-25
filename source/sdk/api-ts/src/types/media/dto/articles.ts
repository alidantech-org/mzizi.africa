/** An article record with no text; its texts per language are `media.texts`. */
export interface MediaArticles {
  authorId?: string | null;
  categoryTerm: string;
  code: string;
  contributorId?: string | null;
  createdAt: string;
  deletedAt?: string | null;
  id: string;
  identityId?: string | null;
  publishedAt?: string | null;
  updatedAt: string;
  version: number;
}
