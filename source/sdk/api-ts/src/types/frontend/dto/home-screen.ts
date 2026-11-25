import type { FrontendCountryLink } from "#sdk/types/frontend/dto/country-link.ts";
import type { FrontendLanguageOption } from "#sdk/types/frontend/dto/language-option.ts";

/** Home Screen */
export interface FrontendHomeScreen {
  countries: FrontendCountryLink[];
  language: string;
  languages: FrontendLanguageOption[];
}
