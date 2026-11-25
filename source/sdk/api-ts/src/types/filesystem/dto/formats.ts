/** A technical file format: suffix and media type, never a document classification. */
export interface FilesystemFormats {
  code: string;
  contentType: string;
  createdAt: string;
  deletedAt?: string | null;
  extension: string;
  id: string;
  updatedAt: string;
  version: number;
}
