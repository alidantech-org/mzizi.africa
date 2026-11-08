
import type { Decision } from "#/types/audit/decision.enum.ts";
import type { VerificationState } from "#/types/shared/verification-state.enum.ts";
import type { Id } from "#/types/shared/id.type.ts";
import type { LongText } from "#/types/shared/long-text.type.ts";
import type { TargetKind } from "#/types/shared/target-kind.type.ts";

/** Create Review Decision Body */
export interface CreateReviewDecisionBody {
  decision: Decision;
  proposedState: VerificationState;
  rationale: LongText;
  targetId: Id;
  targetKind: TargetKind;
}