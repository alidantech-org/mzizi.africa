
import type { Text } from "#/types/pipeline/text.type.ts";
import type { Id } from "#/types/shared/id.type.ts";
import type { Label } from "#/types/shared/label.type.ts";
import type { PaginationNumber } from "#/types/shared/pagination-number.type.ts";
import type { DateTime } from "#/types/shared/date-time.type.ts";

/** Job Summary */
export interface JobSummary {
  attempts: PaginationNumber;
  createdAt: DateTime;
  error?: Text | null;
  id: Id;
  kind: Label;
  status: Label;
}