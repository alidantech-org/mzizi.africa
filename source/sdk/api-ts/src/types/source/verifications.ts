import { SourceVerificationOutcome } from "#sdk/types/enums/source/verification-outcome.ts";

/** Append-only attributable assessment; disagreement and insufficient evidence remain explicit outcomes. */
export interface SourceVerifications {
  assessedAt: string;
  code: string;
  confidence?: number | null;
  createdAt: string;
  deletedAt?: string | null;
  evidenceId: string;
  explanation: string;
  id: string;
  methodId: string;
  outcome: SourceVerificationOutcome;
  reviewerSnapshot: string;
  supersedesId?: string | null;
  updatedAt: string;
  version: number;
}
