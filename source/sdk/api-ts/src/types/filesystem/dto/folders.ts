import { FilesystemAccess } from "#sdk/types/filesystem/enums/access.ts";

/** Logical folder hierarchy; access escalation needs a recorded authorization, independent of object keys. */
export interface FilesystemFolders {
  access: FilesystemAccess;
  authorization?: string | null;
  code: string;
  createdAt: string;
  deletedAt?: string | null;
  id: string;
  name: string;
  parentId?: string | null;
  roleTerm: string;
  updatedAt: string;
  version: number;
}
