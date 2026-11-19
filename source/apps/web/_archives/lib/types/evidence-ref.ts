import type { FieldMeta } from "#/_archives/lib/dryv/transport";

/** Evidence Ref */
export interface EvidenceRef {
  artifactTitle?: string | null;
  citationId: string;
  confidence?: number | null;
  locator?: string | null;
  publisherName?: string | null;
  retrievedAt?: string | null;
  sourceName: string;
  verification?: string | null;
}

/** Field metadata for forms and results. */
export const EvidenceRefFields: readonly FieldMeta[] = [
  {
    name: "artifactTitle",
    label: "Artifact Title",
    kind: "string",
    required: false,
  },
  { name: "citationId", label: "Citation Id", kind: "string", required: true },
  { name: "confidence", label: "Confidence", kind: "number", required: false },
  { name: "locator", label: "Locator", kind: "string", required: false },
  {
    name: "publisherName",
    label: "Publisher Name",
    kind: "string",
    required: false,
  },
  { name: "retrievedAt", label: "Retrieved At", kind: "date", required: false },
  { name: "sourceName", label: "Source Name", kind: "string", required: true },
  {
    name: "verification",
    label: "Verification",
    kind: "string",
    required: false,
  },
];
