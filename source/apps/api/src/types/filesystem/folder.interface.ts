
import type { Visibility } from "#/types/filesystem/visibility.enum.ts";
import type { FileName } from "#/types/filesystem/file-name.type.ts";
import type { FolderPath } from "#/types/filesystem/folder-path.type.ts";
import type { Count } from "#/types/shared/count.type.ts";
import type { Id } from "#/types/shared/id.type.ts";
import type { Version } from "#/types/shared/version.type.ts";
import type { BaseEntity } from "#/types/shared/base-entity.interface.ts";
import type { DateTime } from "#/types/shared/date-time.type.ts";

/** Folder */
export interface Folder {
  createdAt: DateTime;
  depth: Count;
  id: Id;
  name: FileName;
  parentId?: Id | null;
  path: FolderPath;
  updatedAt: DateTime;
  version: Version;
  visibility: Visibility;
}