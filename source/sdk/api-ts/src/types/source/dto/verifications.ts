import { SharedSubjectTable } from "#sdk/types/shared/enums/subject-table.ts";
import { SourceVerificationOutcome } from "#sdk/types/source/enums/verification-outcome.ts";

/** Append-only attributable assessment of one reviewed subject (a claim row or a relationship); disagreement stays explicit. */
export interface SourceVerifications {
  assessedAt: string;
  code: string;
  confidence?: number | null;
  createdAt: string;
  deletedAt?: string | null;
  explanation: string;
  id: string;
  methodId: string;
  outcome: SourceVerificationOutcome;
  reviewerSnapshot: string;
  subjectId: string;
  subjectTable: SharedSubjectTable;
  supersedesId?: string | null;
  updatedAt: string;
  version: number;
}
