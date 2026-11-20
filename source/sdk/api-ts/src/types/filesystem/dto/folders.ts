import { FilesystemAccess } from "#sdk/types/filesystem/enums/access.ts";

/** Logical hierarchy; access escalation requires recorded authorization, independent of object keys. */
export interface FilesystemFolders {
  access: FilesystemAccess;
  authorization?: string | null;
  code: string;
  createdAt: string;
  deletedAt?: string | null;
  id: string;
  name: string;
  parentId?: string | null;
  roleId: string;
  updatedAt: string;
  version: number;
}
