/** A distinct piece of content identified by its sha256. The same file fetched from many sources is one document with many captures. */
export interface SourceDocuments {
  code: string;
  contentType?: string | null;
  createdAt: string;
  deletedAt?: string | null;
  fileVersionId?: string | null;
  id: string;
  kindId: string;
  parentId?: string | null;
  publishedOn?: string | null;
  publisherId?: string | null;
  sha256: string;
  sizeBytes?: number | null;
  title: string;
  updatedAt: string;
  version: number;
}
