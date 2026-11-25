import type { MediaArticleEntryTitles } from "#sdk/types/media/dto/article-entry-titles.ts";

/** Article Entry */
export interface MediaArticleEntry {
  articleId: string;
  categoryTerm: string;
  code: string;
  publishedAt: string | null;
  titles: MediaArticleEntryTitles[];
}
