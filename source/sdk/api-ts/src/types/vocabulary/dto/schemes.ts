import { VocabularySchemeAnswers } from "#sdk/types/vocabulary/enums/scheme-answers.ts";
import { VocabularySchemeShape } from "#sdk/types/vocabulary/enums/scheme-shape.ts";

/** A controlled list such as feature kind, institution arm, topic, sex or age group. Its words are `vocabulary.labels`; it holds no display text. */
export interface VocabularySchemes {
  answers: VocabularySchemeAnswers;
  code: string;
  countryId?: string | null;
  createdAt: string;
  deletedAt?: string | null;
  id: string;
  isDated: boolean;
  isOpen: boolean;
  shape: VocabularySchemeShape;
  stewardId?: string | null;
  updatedAt: string;
  version: number;
}
