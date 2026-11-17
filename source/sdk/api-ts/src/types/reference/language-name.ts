import { ReferenceLanguageNameKind } from "#sdk/types/enums/reference/language-name-kind.ts";

/** A name of a language written in a language, such as Kiswahili (endonym) and Swahili (exonym). */
export interface ReferenceLanguageName {
  createdAt: string;
  deletedAt?: string | null;
  id: string;
  inLanguageId: string;
  languageId: string;
  name: string;
  nameKind: ReferenceLanguageNameKind;
  updatedAt: string;
  validFrom?: string | null;
  validUntil?: string | null;
  version: number;
}
