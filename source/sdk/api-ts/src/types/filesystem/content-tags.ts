/** Tags a content text; a text may have several. */
export interface FilesystemContentTags {
  contentId: string;
  createdAt: string;
  deletedAt?: string | null;
  id: string;
  tagId: string;
  updatedAt: string;
  version: number;
}
