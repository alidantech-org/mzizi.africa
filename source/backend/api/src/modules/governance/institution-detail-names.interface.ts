
import type { Flag } from "#/modules/shared/flag.type.ts";
import type { LanguageTag } from "#/modules/shared/language-tag.type.ts";
import type { Name } from "#/modules/shared/name.type.ts";

/** Institution Detail Names */
export interface InstitutionDetailNames {
  isPreferred: Flag;
  languageTag: LanguageTag | null;
  name: Name;
}