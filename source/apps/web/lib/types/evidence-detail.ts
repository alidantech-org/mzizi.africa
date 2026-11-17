import type { FieldMeta } from "#/lib/dryv/transport.ts";
import { type EvidenceRef } from "#/lib/types/evidence-ref.ts";
import { type MediaRef } from "#/lib/types/media-ref.ts";

/** Evidence Detail */
export interface EvidenceDetail {
  editionLabel?: string | null;
  evidence: EvidenceRef;
  files: MediaRef[];
  quotedText?: string | null;
  sourceCode?: string | null;
  sourceId?: string | null;
}

/** Field metadata for forms and results. */
export const EvidenceDetailFields: readonly FieldMeta[] = [
  { name: "editionLabel", label: "Edition Label", kind: "string", required: false },
  { name: "evidence", label: "Evidence", kind: "other", required: true },
  { name: "files", label: "Files", kind: "other", required: true },
  { name: "quotedText", label: "Quoted Text", kind: "string", required: false },
  { name: "sourceCode", label: "Source Code", kind: "string", required: false },
  { name: "sourceId", label: "Source Id", kind: "string", required: false },
];
