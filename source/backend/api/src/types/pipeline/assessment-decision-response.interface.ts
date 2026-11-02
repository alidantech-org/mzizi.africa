
import type { Id } from "#/types/shared/id.type.ts";
import type { Label } from "#/types/shared/label.type.ts";

/** Assessment Decision Response */
export interface AssessmentDecisionResponse {
  assessmentId: Id;
  newAssessmentId: Id;
  outcome: Label;
}