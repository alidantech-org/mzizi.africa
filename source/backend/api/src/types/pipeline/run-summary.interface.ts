
import type { Id } from "#/types/shared/id.type.ts";
import type { Label } from "#/types/shared/label.type.ts";
import type { PaginationNumber } from "#/types/shared/pagination-number.type.ts";
import type { DateTime } from "#/types/shared/date-time.type.ts";

/** Run Summary */
export interface RunSummary {
  candidates: PaginationNumber;
  createdAt: DateTime;
  dataset: Label;
  id: Id;
  mappingVersion: Label;
  status: Label;
}