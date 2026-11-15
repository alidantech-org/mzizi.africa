
import type { VerificationOutcome } from "#/modules/source/verification-outcome.enum.ts";
import type { Confidence } from "#/modules/shared/confidence.type.ts";
import type { Description } from "#/modules/shared/description.type.ts";
import type { Id } from "#/modules/shared/id.type.ts";
import type { JsonText } from "#/modules/shared/json-text.type.ts";
import type { PositiveInteger } from "#/modules/shared/positive-integer.type.ts";
import type { Instant } from "#/modules/shared/instant.type.ts";

/** Append-only attributable assessment; disagreement and insufficient evidence remain explicit outcomes. */
export interface Verifications {
  assessedAt: Instant;
  confidence?: Confidence | null;
  createdAt: Instant;
  deletedAt?: Instant | null;
  evidenceId: Id;
  explanation: Description;
  id: Id;
  methodId: Id;
  outcome: VerificationOutcome;
  reviewerSnapshot: JsonText;
  supersedesId?: Id | null;
  updatedAt: Instant;
  version: PositiveInteger;
}