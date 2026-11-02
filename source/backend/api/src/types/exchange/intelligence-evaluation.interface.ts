
import type { EvaluationKind } from "#/types/exchange/evaluation-kind.enum.ts";
import type { ContractVersion } from "#/types/exchange/contract-version.type.ts";
import type { JsonDocument } from "#/types/exchange/json-document.type.ts";
import type { Sha256 } from "#/types/exchange/sha256.type.ts";
import type { Confidence } from "#/types/shared/confidence.type.ts";
import type { Id } from "#/types/shared/id.type.ts";
import type { Label } from "#/types/shared/label.type.ts";
import type { LongText } from "#/types/shared/long-text.type.ts";
import type { DateTime } from "#/types/shared/date-time.type.ts";

/** Intelligence Evaluation */
export interface IntelligenceEvaluation {
  confidence?: Confidence;
  createdAt: DateTime;
  explanation?: LongText;
  id: Id;
  inputHash: Sha256;
  kind: EvaluationKind;
  model?: Label;
  output: JsonDocument;
  subjectCandidateId?: Id;
  subjectResultId?: Id;
  tool: Label;
  toolVersion: ContractVersion;
}