import type { LanguageCode } from "#/modules/explorer/schema/type/language-code.type.ts";
import type { NonEmptyString500 } from "#/modules/shared/schema/type/non-empty-string500.type.ts";
import type { CopyEntry } from "#/modules/explorer/schema/interface/copy-entry.interface.ts";
import type { CountryChoice } from "#/modules/explorer/schema/interface/country-choice.interface.ts";
import type { LanguageChoice } from "#/modules/explorer/schema/interface/language-choice.interface.ts";

/** Bootstrap */
export interface Bootstrap {
  copy: CopyEntry[];
  countries: CountryChoice[];
  gaps: NonEmptyString500[];
  language: LanguageCode;
  languages: LanguageChoice[];
}
