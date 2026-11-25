import type { NameText } from "#/modules/identity/schema/type/name-text.type.ts";
import type { Integer } from "#/modules/shared/schema/type/integer.type.ts";

/** Name Search */
export interface NameSearch {
  limit?: Integer;
  offset?: Integer;
  text: NameText;
}
