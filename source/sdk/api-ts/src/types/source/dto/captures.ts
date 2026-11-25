/** One fetch of a path. */
export interface SourceCaptures {
  artifactId?: string | null;
  contentType?: string | null;
  createdAt: string;
  discoveredAt?: string | null;
  discoveryId?: string | null;
  etag?: string | null;
  id: string;
  lastModified?: string | null;
  originalUrl: string;
  pathId?: string | null;
  retrievedAt: string;
  retrievedUrl?: string | null;
  sourceId?: string | null;
  statusCode?: number | null;
}
