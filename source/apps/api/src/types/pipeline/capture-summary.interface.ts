
import type { Text } from "#/types/pipeline/text.type.ts";
import type { Id } from "#/types/shared/id.type.ts";
import type { Label } from "#/types/shared/label.type.ts";
import type { PaginationNumber } from "#/types/shared/pagination-number.type.ts";
import type { DateTime } from "#/types/shared/date-time.type.ts";

/** Capture Summary */
export interface CaptureSummary {
  contentHash?: Label | null;
  documentId: Id;
  documentTitle: Text;
  httpStatus?: PaginationNumber | null;
  id: Id;
  retrievedAt: DateTime;
  retrievedUrl?: Text | null;
  siteId?: Id | null;
  tool?: Text | null;
}