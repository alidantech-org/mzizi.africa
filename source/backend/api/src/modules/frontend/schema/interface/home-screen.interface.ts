import type { LanguageCode } from "#/modules/shared/schema/type/language-code.type.ts";
import type { CountryLink } from "#/modules/frontend/schema/interface/country-link.interface.ts";
import type { LanguageOption } from "#/modules/frontend/schema/interface/language-option.interface.ts";

/** Home Screen */
export interface HomeScreen {
  countries: CountryLink[];
  language: LanguageCode;
  languages: LanguageOption[];
}
