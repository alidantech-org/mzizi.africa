import type { ExplorerCountryChoice } from "#sdk/types/explorer/dto/country-choice.ts";
import type { ExplorerLanguageChoice } from "#sdk/types/explorer/dto/language-choice.ts";

/** Bootstrap */
export interface ExplorerBootstrap {
  countries: ExplorerCountryChoice[];
  gaps: string[];
  language: string;
  languages: ExplorerLanguageChoice[];
}
