import type { LanguageTag } from "#/modules/shared/schema/type/language-tag.type.ts";
import type { Name } from "#/modules/shared/schema/type/name.type.ts";

/** Unit Entry Names */
export interface UnitEntryNames {
  languageTag: LanguageTag | null;
  name: Name;
}
