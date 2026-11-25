import { VocabularyLabelKind } from "#sdk/types/vocabulary/enums/label-kind.ts";

/** Every word for a term or scheme, per language and optional country. Labels have no dates; a changed meaning is a new term. */
export interface VocabularyLabels {
  countryId?: string | null;
  createdAt: string;
  deletedAt?: string | null;
  id: string;
  kind: VocabularyLabelKind;
  languageId: string;
  schemeId?: string | null;
  termId?: string | null;
  text: string;
  updatedAt: string;
  version: number;
}
