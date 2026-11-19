/** Leader Profile Evidence */
export interface InsightsLeaderProfileEvidence {
  artifactTitle: string;
  citationId: string;
  confidence?: number | null;
  locator: string;
  publisherName?: string | null;
  retrievedAt: string;
  sourceName: string;
  verification?: string | null;
}
