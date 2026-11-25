import type { ReferenceLanguageEntryNames } from "#sdk/types/reference/dto/language-entry-names.ts";

/** Language Entry */
export interface ReferenceLanguageEntry {
  code: string;
  directionTerm: string | null;
  iso6391: string | null;
  iso6393: string | null;
  languageId: string;
  names: ReferenceLanguageEntryNames[];
}
