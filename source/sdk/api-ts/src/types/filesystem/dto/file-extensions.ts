/** Technical filename suffix and media-type hint; never a semantic document classification. */
export interface FilesystemFileExtensions {
  code: string;
  contentType: string;
  createdAt: string;
  deletedAt?: string | null;
  description?: string | null;
  extension: string;
  id: string;
  updatedAt: string;
  version: number;
}
