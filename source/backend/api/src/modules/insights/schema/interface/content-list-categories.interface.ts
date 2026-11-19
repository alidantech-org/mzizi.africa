import type { Number } from "#/modules/shared/schema/type/number.type.ts";
import type { String } from "#/modules/shared/schema/type/string.type.ts";

/** Content List Categories */
export interface ContentListCategories {
  code: String;
  count: Number;
  label: String;
}
