/** One tag assignment to exactly one typed file or folder target. */
export interface FilesystemTaggings {
  createdAt: string;
  deletedAt?: string | null;
  fileId?: string | null;
  folderId?: string | null;
  id: string;
  tagId: string;
  updatedAt: string;
  version: number;
}
