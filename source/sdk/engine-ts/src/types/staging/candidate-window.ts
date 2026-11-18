import { StagingCandidateKind } from "#sdk/types/enums/staging/candidate-kind.ts";
import { StagingCandidateStatus } from "#sdk/types/enums/staging/candidate-status.ts";

/** Candidate Window */
export interface StagingCandidateWindow {
  kind?: StagingCandidateKind;
  limit?: number;
  status?: StagingCandidateStatus;
}
