import { VocabularySchemeAnswers } from "#sdk/types/vocabulary/enums/scheme-answers.ts";
import { VocabularySchemeShape } from "#sdk/types/vocabulary/enums/scheme-shape.ts";
import type { VocabularySchemeDetailLabels } from "#sdk/types/vocabulary/dto/scheme-detail-labels.ts";

/** Scheme Detail */
export interface VocabularySchemeDetail {
  answers: VocabularySchemeAnswers;
  code: string;
  isOpen: boolean;
  labels: VocabularySchemeDetailLabels[];
  schemeId: string;
  shape: VocabularySchemeShape;
}
