import { VocabularyTermStatus } from "#sdk/types/vocabulary/enums/term-status.ts";
import type { VocabularyTermEntryLabels } from "#sdk/types/vocabulary/dto/term-entry-labels.ts";

/** Term Entry */
export interface VocabularyTermEntry {
  code: string;
  colorToken: string | null;
  iconCode: string | null;
  labels: VocabularyTermEntryLabels[];
  lower: number | null;
  parentId: string | null;
  position: number | null;
  status: VocabularyTermStatus;
  termId: string;
  upper: number | null;
}
