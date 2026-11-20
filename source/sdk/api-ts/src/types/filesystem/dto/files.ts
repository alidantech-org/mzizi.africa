import { FilesystemRetention } from "#sdk/types/filesystem/enums/retention.ts";

/** Stable logical file identity; equal content hashes may belong to different files. */
export interface FilesystemFiles {
  code: string;
  createdAt: string;
  currentVersionId?: string | null;
  deletedAt?: string | null;
  folderId: string;
  id: string;
  name: string;
  retention: FilesystemRetention;
  updatedAt: string;
  version: number;
}
