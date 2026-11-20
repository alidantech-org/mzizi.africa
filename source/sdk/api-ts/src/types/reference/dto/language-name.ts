import { ReferenceLanguageNameKind } from "#sdk/types/reference/enums/language-name-kind.ts";

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
  version: number;
}
