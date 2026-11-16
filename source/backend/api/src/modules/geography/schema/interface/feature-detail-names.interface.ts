import type { LanguageTag } from "#/modules/shared/schema/type/language-tag.type.ts";
import type { Name } from "#/modules/shared/schema/type/name.type.ts";

/** Feature Detail Names */
export interface FeatureDetailNames {
  languageTag: LanguageTag | null;
  name: Name;
}
