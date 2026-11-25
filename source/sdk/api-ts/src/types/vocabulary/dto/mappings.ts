import { VocabularyMappingKind } from "#sdk/types/vocabulary/enums/mapping-kind.ts";

/** Links between terms across schemes and countries. Loops in broader and narrower links are refused by Mzizi's write code. */
export interface VocabularyMappings {
  createdAt: string;
  deletedAt?: string | null;
  fromId: string;
  id: string;
  kind: VocabularyMappingKind;
  toId: string;
}
