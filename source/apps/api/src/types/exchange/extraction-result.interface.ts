
import type { ExtractionStatus } from "#/types/exchange/extraction-status.enum.ts";
import type { ContractVersion } from "#/types/exchange/contract-version.type.ts";
import type { Sha256 } from "#/types/exchange/sha256.type.ts";
import type { Id } from "#/types/shared/id.type.ts";
import type { Label } from "#/types/shared/label.type.ts";
import type { ExtractionDiagnostic } from "#/types/exchange/extraction-diagnostic.interface.ts";
import type { ExtractionSegment } from "#/types/exchange/extraction-segment.interface.ts";
import type { FileArtifactRef } from "#/types/exchange/file-artifact-ref.interface.ts";
import type { DateTime } from "#/types/shared/date-time.type.ts";

/** Extraction Result */
export interface ExtractionResult {
  artifact: FileArtifactRef;
  diagnostics: ExtractionDiagnostic[];
  extractor: Label;
  extractorVersion: ContractVersion;
  finishedAt: DateTime;
  id: Id;
  inputHash: Sha256;
  profile?: Label;
  segments: ExtractionSegment[];
  startedAt: DateTime;
  status: ExtractionStatus;
  structureVersionId?: Id;
  supersedesResultId?: Id;
}