import type { Limit } from "#/modules/insights/schema/type/limit.type.ts";
import type { Text } from "#/modules/insights/schema/type/text.type.ts";
import type { NonEmptyString100 } from "#/modules/shared/schema/type/non-empty-string100.type.ts";
import type { NonEmptyString500 } from "#/modules/shared/schema/type/non-empty-string500.type.ts";

/** Search Query */
export interface SearchQuery {
  kinds?: NonEmptyString500;
  languageCode?: NonEmptyString100;
  limit?: Limit;
  query: Text;
}
