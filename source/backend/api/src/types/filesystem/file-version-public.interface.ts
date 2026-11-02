
import type { Description } from "#/types/shared/description.type.ts";
import type { Id } from "#/types/shared/id.type.ts";
import type { Version } from "#/types/shared/version.type.ts";
import type { File } from "#/types/filesystem/file.interface.ts";
import type { DateTime } from "#/types/shared/date-time.type.ts";

/** File Version Public */
export interface FileVersionPublic {
  createdAt: DateTime;
  fileId: Id;
  id: Id;
  note?: Description | null;
  objectId: Id;
  updatedAt: DateTime;
  uploadedBy?: Id | null;
  version: Version;
  versionNumber: Version;
}