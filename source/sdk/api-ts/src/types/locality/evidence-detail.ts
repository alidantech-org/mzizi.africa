import type { LocalityEvidenceRef } from "#sdk/types/locality/evidence-ref.ts";
import type { LocalityMediaRef } from "#sdk/types/locality/media-ref.ts";

/** Evidence Detail */
export interface LocalityEvidenceDetail {
  editionLabel?: string | null;
  evidence: LocalityEvidenceRef;
  files: LocalityMediaRef[];
  quotedText?: string | null;
  sourceCode?: string | null;
  sourceId?: string | null;
}
