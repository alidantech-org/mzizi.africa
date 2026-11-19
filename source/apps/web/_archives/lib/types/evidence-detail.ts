import type { FieldMeta } from "#/_archives/lib/dryv/transport";
import { type EvidenceRef } from "#/_archives/lib/types/evidence-ref";
import { type MediaRef } from "#/_archives/lib/types/media-ref";

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
  {
    name: "editionLabel",
    label: "Edition Label",
    kind: "string",
    required: false,
  },
  { name: "evidence", label: "Evidence", kind: "other", required: true },
  { name: "files", label: "Files", kind: "other", required: true },
  { name: "quotedText", label: "Quoted Text", kind: "string", required: false },
  { name: "sourceCode", label: "Source Code", kind: "string", required: false },
  { name: "sourceId", label: "Source Id", kind: "string", required: false },
];
