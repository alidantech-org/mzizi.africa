import { SharedSubjectTable } from "#sdk/types/shared/enums/subject-table.ts";
import { SourceVerificationOutcome } from "#sdk/types/source/enums/verification-outcome.ts";

/** A review decision about one row, against what and when. */
export interface SourceVerifications {
  assessedAt: string;
  code: string;
  confidence?: number | null;
  createdAt: string;
  deletedAt?: string | null;
  id: string;
  methodTerm: string;
  note?: string | null;
  noteLanguageId?: string | null;
  outcome: SourceVerificationOutcome;
  reviewerId?: string | null;
  subjectId: string;
  subjectTable: SharedSubjectTable;
  supersedesId?: string | null;
  updatedAt: string;
  version: number;
}
