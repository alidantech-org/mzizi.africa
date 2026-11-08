
import type { TargetKind } from "#/types/pipeline/target-kind.type.ts";
import type { Confidence } from "#/types/shared/confidence.type.ts";
import type { Id } from "#/types/shared/id.type.ts";
import type { Label } from "#/types/shared/label.type.ts";
import type { PaginationNumber } from "#/types/shared/pagination-number.type.ts";
import type { DateTime } from "#/types/shared/date-time.type.ts";

/** Candidate Summary */
export interface CandidateSummary {
  confidence?: Confidence | null;
  createdAt: DateTime;
  id: Id;
  issueCount: PaginationNumber;
  method: Label;
  runId: Id;
  status: Label;
  targetKind: TargetKind;
}