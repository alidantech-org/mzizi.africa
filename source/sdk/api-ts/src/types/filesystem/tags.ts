/** One shared tag catalogue for files and folders. */
export interface FilesystemTags {
  code: string;
  createdAt: string;
  deletedAt?: string | null;
  description?: string | null;
  id: string;
  title: string;
  updatedAt: string;
  version: number;
}
