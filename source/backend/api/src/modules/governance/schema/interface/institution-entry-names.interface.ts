import type { Flag } from "#/modules/shared/schema/type/flag.type.ts";
import type { LanguageTag } from "#/modules/shared/schema/type/language-tag.type.ts";
import type { Name } from "#/modules/shared/schema/type/name.type.ts";

/** Institution Entry Names */
export interface InstitutionEntryNames {
  isPreferred: Flag;
  languageTag: LanguageTag | null;
  name: Name;
}
