import { StagingCandidateKind } from "#sdk/types/enums/staging/candidate-kind.ts";
import { StagingCandidateStatus } from "#sdk/types/enums/staging/candidate-status.ts";

/** Candidate */
export interface StagingCandidate {
  captureIds: string[];
  confidence?: number;
  createdAt: string;
  decidedAt?: string;
  decidedBy?: string;
  id: string;
  kind: StagingCandidateKind;
  ledgerId?: string;
  payload: unknown;
  proposedBy: string;
  status: StagingCandidateStatus;
  targetTable?: string;
}
