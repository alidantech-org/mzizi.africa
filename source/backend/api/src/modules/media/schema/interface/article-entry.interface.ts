import type { Id } from "#/modules/shared/schema/type/id.type.ts";
import type { IdentityCode } from "#/modules/shared/schema/type/identity-code.type.ts";
import type { ArticleEntryTitles } from "#/modules/media/schema/interface/article-entry-titles.interface.ts";
import type { Instant } from "#/modules/shared/schema/type/instant.type.ts";

/** Article Entry */
export interface ArticleEntry {
  articleId: Id;
  categoryTerm: Id;
  code: IdentityCode;
  publishedAt: Instant | null;
  titles: ArticleEntryTitles[];
}
