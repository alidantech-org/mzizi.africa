/** A host name a source is served from. A host belongs to one source at a time; its validity period records moves. */
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
