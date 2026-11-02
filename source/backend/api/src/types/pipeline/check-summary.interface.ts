
import type { Text } from "#/types/pipeline/text.type.ts";
import type { Id } from "#/types/shared/id.type.ts";
import type { Label } from "#/types/shared/label.type.ts";
import type { DateTime } from "#/types/shared/date-time.type.ts";

/** Check Summary */
export interface CheckSummary {
  checkedAt: DateTime;
  detail?: Text | null;
  id: Id;
  kind: Label;
  outcome: Label;
  siteId: Id;
  siteName: Label;
}