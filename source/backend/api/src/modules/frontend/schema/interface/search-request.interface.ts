import type { SearchText } from "#/modules/frontend/schema/type/search-text.type.ts";
import type { IdentityCode } from "#/modules/shared/schema/type/identity-code.type.ts";

/** Search Request */
export interface SearchRequest {
  country?: IdentityCode;
  lang?: IdentityCode;
  text: SearchText;
}
