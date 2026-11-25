import { VocabularyLabelKind } from "#sdk/types/vocabulary/enums/label-kind.ts";

/** Scheme Detail Labels */
export interface VocabularySchemeDetailLabels {
  kind: VocabularyLabelKind;
  languageCode: string;
  text: string;
}
