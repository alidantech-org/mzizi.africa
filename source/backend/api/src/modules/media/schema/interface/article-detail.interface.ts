import type { Id } from "#/modules/shared/schema/type/id.type.ts";
import type { IdentityCode } from "#/modules/shared/schema/type/identity-code.type.ts";
import type { ArticleDetailTexts } from "#/modules/media/schema/interface/article-detail-texts.interface.ts";
import type { Instant } from "#/modules/shared/schema/type/instant.type.ts";

/** Article Detail */
export interface ArticleDetail {
  articleId: Id;
  categoryTerm: Id;
  code: IdentityCode;
  identityId: Id | null;
  publishedAt: Instant | null;
  texts: ArticleDetailTexts[];
}
