import { VocabularyTermStatus } from "#sdk/types/vocabulary/enums/term-status.ts";

/** A member of one scheme: a code, its place in the scheme, display hints and optional numeric band. No display text: words are `vocabulary.labels`. */
export interface VocabularyTerms {
  code: string;
  colorToken?: string | null;
  countryId?: string | null;
  createdAt: string;
  deletedAt?: string | null;
  iconCode?: string | null;
  id: string;
  lower?: number | null;
  lowerInclusive?: boolean | null;
  parentId?: string | null;
  position?: number | null;
  schemeId: string;
  status: VocabularyTermStatus;
  supersedesId?: string | null;
  unitId?: string | null;
  updatedAt: string;
  upper?: number | null;
  upperInclusive?: boolean | null;
  version: number;
}
