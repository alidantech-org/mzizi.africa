import { StagingReviewDecision } from "#sdk/types/enums/staging/review-decision.ts";

/** Decision Body */
export interface StagingDecisionBody {
  decision: StagingReviewDecision;
  reason?: string;
}
