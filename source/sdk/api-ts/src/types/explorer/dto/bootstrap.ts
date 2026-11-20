import type { ExplorerCopyEntry } from "#sdk/types/explorer/dto/copy-entry.ts";
import type { ExplorerCountryChoice } from "#sdk/types/explorer/dto/country-choice.ts";
import type { ExplorerLanguageChoice } from "#sdk/types/explorer/dto/language-choice.ts";

/** Bootstrap */
export interface ExplorerBootstrap {
  copy: ExplorerCopyEntry[];
  countries: ExplorerCountryChoice[];
  gaps: string[];
  language: string;
  languages: ExplorerLanguageChoice[];
}
