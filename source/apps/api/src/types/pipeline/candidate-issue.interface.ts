
import type { Text } from "#/types/pipeline/text.type.ts";
import type { Label } from "#/types/shared/label.type.ts";

/** Candidate Issue */
export interface CandidateIssue {
  message: Text;
  rule: Label;
  severity: Label;
}