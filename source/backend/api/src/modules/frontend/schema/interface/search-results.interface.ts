import type { LanguageCode } from "#/modules/shared/schema/type/language-code.type.ts";
import type { SearchHit } from "#/modules/frontend/schema/interface/search-hit.interface.ts";

/** Search Results */
export interface SearchResults {
  hits: SearchHit[];
  language: LanguageCode;
}
