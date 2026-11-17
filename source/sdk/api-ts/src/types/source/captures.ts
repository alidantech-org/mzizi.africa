/** One retrieval of a path by a source: when, from which link, with what response. The content is a document, shared by every capture of the same bytes; failed requests remain in Operations. */
export interface SourceCaptures {
  code: string;
  createdAt: string;
  deletedAt?: string | null;
  documentId?: string | null;
  id: string;
  manifestReleaseId?: string | null;
  originalUrl: string;
  pathId?: string | null;
  responseMetadata: string;
  retrievedAt: string;
  retrievedUrl?: string | null;
  sourceId: string;
  updatedAt: string;
  version: number;
}
