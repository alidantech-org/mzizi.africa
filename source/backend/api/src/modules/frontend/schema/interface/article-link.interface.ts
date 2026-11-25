import type { IdentityCode } from "#/modules/shared/schema/type/identity-code.type.ts";
import type { LocalizedText } from "#/modules/shared/schema/interface/localized-text.interface.ts";

/** Article Link */
export interface ArticleLink {
  code: IdentityCode;
  title: LocalizedText;
}
