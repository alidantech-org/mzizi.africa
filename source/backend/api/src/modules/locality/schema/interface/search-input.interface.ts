import type { LanguageCode } from "#/modules/locality/schema/type/language-code.type.ts";
import type { SearchText } from "#/modules/locality/schema/type/search-text.type.ts";
import type { Integer } from "#/modules/shared/schema/type/integer.type.ts";

/** Search Input */
export interface SearchInput {
  languageCode?: LanguageCode;
  limit?: Integer;
  query: SearchText;
}
