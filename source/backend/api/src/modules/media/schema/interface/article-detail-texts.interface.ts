import type { TextOrigin } from "#/modules/media/schema/enum/text-origin.enum.ts";
import type { TextStatus } from "#/modules/media/schema/enum/text-status.enum.ts";
import type { Markdown } from "#/modules/media/schema/type/markdown.type.ts";
import type { Summary } from "#/modules/media/schema/type/summary.type.ts";
import type { Title } from "#/modules/media/schema/type/title.type.ts";
import type { IdentityCode } from "#/modules/shared/schema/type/identity-code.type.ts";

/** Article Detail Texts */
export interface ArticleDetailTexts {
  body: Markdown;
  languageCode: IdentityCode;
  origin: TextOrigin;
  status: TextStatus;
  summary: Summary | null;
  title: Title;
}
