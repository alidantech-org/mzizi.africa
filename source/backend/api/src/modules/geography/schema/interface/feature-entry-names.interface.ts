import type { LanguageTag } from "#/modules/shared/schema/type/language-tag.type.ts";
import type { Name } from "#/modules/shared/schema/type/name.type.ts";

/** Feature Entry Names */
export interface FeatureEntryNames {
  languageTag: LanguageTag | null;
  name: Name;
}
