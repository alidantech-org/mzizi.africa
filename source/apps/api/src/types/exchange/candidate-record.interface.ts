
import type { CandidateStatus } from "#/types/exchange/candidate-status.enum.ts";
import type { ProvenanceMethod } from "#/types/shared/provenance-method.enum.ts";
import type { JsonDocument } from "#/types/exchange/json-document.type.ts";
import type { Sha256 } from "#/types/exchange/sha256.type.ts";
import type { Target } from "#/types/exchange/target.type.ts";
import type { Confidence } from "#/types/shared/confidence.type.ts";
import type { Id } from "#/types/shared/id.type.ts";
import type { Label } from "#/types/shared/label.type.ts";

/** Candidate Record */
export interface CandidateRecord {
  confidence?: Confidence;
  extractionResultId: Id;
  id: Id;
  locator?: JsonDocument;
  method: ProvenanceMethod;
  naturalKeyHash: Sha256;
  payload: JsonDocument;
  resolvedTargetId?: Id;
  runId: Id;
  segmentKey?: Label;
  status: CandidateStatus;
  supersedesCandidateId?: Id;
  target: Target;
}