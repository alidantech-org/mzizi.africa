
import type { JsonText } from "#/types/pipeline/json-text.type.ts";
import type { Text } from "#/types/pipeline/text.type.ts";
import type { Id } from "#/types/shared/id.type.ts";
import type { Label } from "#/types/shared/label.type.ts";

/** Draft Assessment Request */
export interface DraftAssessmentRequest {
  accessBasis: Label;
  approvedScope: JsonText;
  evidence?: Text;
  rationale?: Text;
  rightsHolder: Text;
  siteId: Id;
  sourceType: Label;
}