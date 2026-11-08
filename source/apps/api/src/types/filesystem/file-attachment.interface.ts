
import type { AttachmentRole } from "#/types/filesystem/attachment-role.type.ts";
import type { Count } from "#/types/shared/count.type.ts";
import type { Id } from "#/types/shared/id.type.ts";
import type { TargetKind } from "#/types/shared/target-kind.type.ts";
import type { Version } from "#/types/shared/version.type.ts";
import type { File } from "#/types/filesystem/file.interface.ts";
import type { BaseEntity } from "#/types/shared/base-entity.interface.ts";
import type { DateTime } from "#/types/shared/date-time.type.ts";

/** File Attachment */
export interface FileAttachment {
  createdAt: DateTime;
  fileId: Id;
  id: Id;
  position: Count;
  role: AttachmentRole;
  targetId: Id;
  targetKind: TargetKind;
  updatedAt: DateTime;
  version: Version;
}