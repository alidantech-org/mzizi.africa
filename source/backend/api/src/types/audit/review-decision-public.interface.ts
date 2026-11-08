
import type { Decision } from "#/types/audit/decision.enum.ts";
import type { VerificationState } from "#/types/shared/verification-state.enum.ts";
import type { Id } from "#/types/shared/id.type.ts";
import type { LongText } from "#/types/shared/long-text.type.ts";
import type { TargetKind } from "#/types/shared/target-kind.type.ts";
import type { Version } from "#/types/shared/version.type.ts";
import type { DateTime } from "#/types/shared/date-time.type.ts";

/** Review Decision Public */
export interface ReviewDecisionPublic {
  createdAt: DateTime;
  decision: Decision;
  id: Id;
  proposedState: VerificationState;
  rationale: LongText;
  reviewerId: Id;
  targetId: Id;
  targetKind: TargetKind;
  updatedAt: DateTime;
  version: Version;
}