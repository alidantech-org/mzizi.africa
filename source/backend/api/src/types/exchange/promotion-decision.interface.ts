
import type { PromotionOutcome } from "#/types/exchange/promotion-outcome.enum.ts";
import type { VerificationState } from "#/types/shared/verification-state.enum.ts";
import type { Target } from "#/types/exchange/target.type.ts";
import type { Id } from "#/types/shared/id.type.ts";
import type { Message } from "#/types/shared/message.type.ts";
import type { DateTime } from "#/types/shared/date-time.type.ts";

/** Promotion Decision */
export interface PromotionDecision {
  auditDecisionId: Id;
  candidateId: Id;
  decidedAt: DateTime;
  id: Id;
  outcome: PromotionOutcome;
  previousTargetId?: Id;
  reasons: Message[];
  target: Target;
  targetId?: Id;
  verificationState: VerificationState;
}