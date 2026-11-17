/** A host name a source is served from. A source can have several over time, and a domain keeps its own validity period. */
export interface SourceDomains {
  code: string;
  createdAt: string;
  deletedAt?: string | null;
  host: string;
  id: string;
  sourceId: string;
  updatedAt: string;
  validFrom?: string | null;
  validUntil?: string | null;
  version: number;
}
