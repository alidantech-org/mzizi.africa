import type { Code } from "#/modules/insights/schema/type/code.type.ts";
import type { Limit } from "#/modules/insights/schema/type/limit.type.ts";
import type { Text } from "#/modules/insights/schema/type/text.type.ts";
import type { NonEmptyString100 } from "#/modules/shared/schema/type/non-empty-string100.type.ts";

/** Content List Input */
export interface ContentListInput {
  category?: Code;
  languageCode?: NonEmptyString100;
  limit?: Limit;
  query?: Text;
  tag?: Code;
}
