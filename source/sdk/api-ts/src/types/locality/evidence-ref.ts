/** Evidence Ref */
export interface LocalityEvidenceRef {
  artifactTitle?: string | null;
  citationId: string;
  confidence?: number | null;
  locator?: string | null;
  publisherName?: string | null;
  retrievedAt?: string | null;
  sourceName: string;
  verification?: string | null;
}
