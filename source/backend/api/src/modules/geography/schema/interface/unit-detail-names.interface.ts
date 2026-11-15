
import type { LanguageTag } from "#/modules/shared/schema/type/language-tag.type.ts";
import type { Name } from "#/modules/shared/schema/type/name.type.ts";

/** Unit Detail Names */
export interface UnitDetailNames {
  languageTag: LanguageTag | null;
  name: Name;
}