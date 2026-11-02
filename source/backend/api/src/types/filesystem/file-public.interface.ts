
import type { FileStatus } from "#/types/filesystem/file-status.enum.ts";
import type { Visibility } from "#/types/filesystem/visibility.enum.ts";
import type { FileName } from "#/types/filesystem/file-name.type.ts";
import type { Flag } from "#/types/shared/flag.type.ts";
import type { Id } from "#/types/shared/id.type.ts";
import type { Version } from "#/types/shared/version.type.ts";
import type { Folder } from "#/types/filesystem/folder.interface.ts";
import type { DateTime } from "#/types/shared/date-time.type.ts";

/** File Public */
export interface FilePublic {
  createdAt: DateTime;
  currentVersionId?: Id | null;
  folderId: Id;
  id: Id;
  isLegalHold: Flag;
  name: FileName;
  ownerAccountId?: Id | null;
  status: FileStatus;
  trashedAt?: DateTime | null;
  updatedAt: DateTime;
  version: Version;
  visibility: Visibility;
}