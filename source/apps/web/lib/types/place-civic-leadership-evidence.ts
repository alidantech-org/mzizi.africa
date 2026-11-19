import type { FieldMeta } from "#/lib/dryv/transport.ts";

/** Place Civic Leadership Evidence */
export interface PlaceCivicLeadershipEvidence {
  artifactTitle: string;
  citationId: string;
  confidence?: number | null;
  locator: string;
  publisherName?: string | null;
  retrievedAt: string;
  sourceName: string;
  verification?: string | null;
}

/** Field metadata for forms and results. */
export const PlaceCivicLeadershipEvidenceFields: readonly FieldMeta[] = [
  { name: "artifactTitle", label: "Artifact Title", kind: "string", required: true },
  { name: "citationId", label: "Citation Id", kind: "string", required: true },
  { name: "confidence", label: "Confidence", kind: "number", required: false },
  { name: "locator", label: "Locator", kind: "string", required: true },
  { name: "publisherName", label: "Publisher Name", kind: "string", required: false },
  { name: "retrievedAt", label: "Retrieved At", kind: "string", required: true },
  { name: "sourceName", label: "Source Name", kind: "string", required: true },
  { name: "verification", label: "Verification", kind: "string", required: false },
];
