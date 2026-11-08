
import type { UploadState } from "#/types/filesystem/upload-state.enum.ts";
import type { FileName } from "#/types/filesystem/file-name.type.ts";
import type { ByteCount } from "#/types/shared/byte-count.type.ts";
import type { Checksum } from "#/types/shared/checksum.type.ts";
import type { Id } from "#/types/shared/id.type.ts";
import type { Version } from "#/types/shared/version.type.ts";
import type { BaseEntity } from "#/types/shared/base-entity.interface.ts";
import type { DateTime } from "#/types/shared/date-time.type.ts";

/** Upload Session */
export interface UploadSession {
  completedFileId?: Id | null;
  createdAt: DateTime;
  expectedHash?: Checksum | null;
  expectedSizeBytes: ByteCount;
  expiresAt: DateTime;
  fileName: FileName;
  folderId: Id;
  id: Id;
  requestedBy?: Id | null;
  state: UploadState;
  storeId: Id;
  updatedAt: DateTime;
  version: Version;
}