/** Immutable Main acknowledgement committed atomically with accepted records and provenance. Same-key different-hash retries must conflict. */
export interface SourcePublicationReceipts {
  actorSnapshot: string;
  contractVersion: string;
  createdAt: string;
  deletedAt?: string | null;
  id: string;
  idempotencyKey: string;
  payloadHash: string;
  publicationRefId: string;
  publishedAt: string;
  requestHash: string;
  resultManifest: string;
  updatedAt: string;
  version: number;
}
