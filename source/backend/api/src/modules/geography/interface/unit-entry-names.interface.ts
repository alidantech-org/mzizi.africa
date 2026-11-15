
import type { LanguageTag } from "#/modules/shared/type/language-tag.type.ts";
import type { Name } from "#/modules/shared/type/name.type.ts";

/** Unit Entry Names */
export interface UnitEntryNames {
  languageTag: LanguageTag | null;
  name: Name;
}