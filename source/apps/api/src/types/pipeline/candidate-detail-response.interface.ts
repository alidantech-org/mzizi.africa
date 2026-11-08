
import type { JsonText } from "#/types/pipeline/json-text.type.ts";
import type { Id } from "#/types/shared/id.type.ts";
import type { Label } from "#/types/shared/label.type.ts";
import type { CandidateIssue } from "#/types/pipeline/candidate-issue.interface.ts";
import type { CandidateSummary } from "#/types/pipeline/candidate-summary.interface.ts";

/** Candidate Detail Response */
export interface CandidateDetailResponse {
  candidate: CandidateSummary;
  captureId?: Id | null;
  current?: JsonText | null;
  documentId?: Id | null;
  extractionResultId: Id;
  issues: CandidateIssue[];
  locator?: JsonText | null;
  payload: JsonText;
  segmentKey?: Label | null;
  siteId?: Id | null;
}