
import type { LanguageTag } from "#/modules/shared/language-tag.type.ts";
import type { Name } from "#/modules/shared/name.type.ts";

/** Unit Detail Names */
export interface UnitDetailNames {
  languageTag: LanguageTag | null;
  name: Name;
}