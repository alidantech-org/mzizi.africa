import type { MediaArticleDetailTexts } from "#sdk/types/media/dto/article-detail-texts.ts";

/** Article Detail */
export interface MediaArticleDetail {
  articleId: string;
  categoryTerm: string;
  code: string;
  identityId: string | null;
  publishedAt: string | null;
  texts: MediaArticleDetailTexts[];
}
