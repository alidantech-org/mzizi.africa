
import type { JsonText } from "#/types/pipeline/json-text.type.ts";
import type { Text } from "#/types/pipeline/text.type.ts";
import type { Flag } from "#/types/shared/flag.type.ts";
import type { Id } from "#/types/shared/id.type.ts";
import type { Label } from "#/types/shared/label.type.ts";
import type { DateTime } from "#/types/shared/date-time.type.ts";

/** Assessment Summary */
export interface AssessmentSummary {
  approvedScope: JsonText;
  id: Id;
  isCurrent: Flag;
  rationale?: Text | null;
  reviewedAt?: DateTime | null;
  reviewedBy?: Id | null;
  rightsHolder: Label;
  siteId: Id;
  siteName: Label;
  sourceType: Label;
  status: Label;
}