import { VocabularyLabelKind } from "#sdk/types/vocabulary/enums/label-kind.ts";

/** Term Entry Labels */
export interface VocabularyTermEntryLabels {
  countryId: string | null;
  kind: VocabularyLabelKind;
  languageCode: string;
  text: string;
}
