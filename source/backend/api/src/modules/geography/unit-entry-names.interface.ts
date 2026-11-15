
import type { LanguageTag } from "#/modules/shared/language-tag.type.ts";
import type { Name } from "#/modules/shared/name.type.ts";

/** Unit Entry Names */
export interface UnitEntryNames {
  languageTag: LanguageTag | null;
  name: Name;
}