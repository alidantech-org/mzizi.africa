
import type { VerificationState } from "#/types/shared/verification-state.enum.ts";
import type { Flag } from "#/types/shared/flag.type.ts";
import type { Id } from "#/types/shared/id.type.ts";
import type { LongText } from "#/types/shared/long-text.type.ts";
import type { TargetKind } from "#/types/shared/target-kind.type.ts";
import type { Version } from "#/types/shared/version.type.ts";
import type { BaseEntity } from "#/types/shared/base-entity.interface.ts";
import type { DateTime } from "#/types/shared/date-time.type.ts";

/** Verification */
export interface Verification {
  createdAt: DateTime;
  decidedBy?: Id | null;
  decisionId?: Id | null;
  id: Id;
  isCurrent: Flag;
  rationale?: LongText | null;
  state: VerificationState;
  targetId: Id;
  targetKind: TargetKind;
  updatedAt: DateTime;
  version: Version;
}