/** One exact representation of an edition, tied to immutable bytes. Identical downloads from many sources are one artifact with many captures. */
export interface SourceArtifacts {
  code: string;
  contentType?: string | null;
  createdAt: string;
  deletedAt?: string | null;
  description?: string | null;
  editionId: string;
  fileVersionId?: string | null;
  format?: string | null;
  id: string;
  location?: string | null;
  parentId?: string | null;
  sha256: string;
  sizeBytes?: number | null;
  updatedAt: string;
  version: number;
}
