
import type { ScanStatus } from "#/types/filesystem/scan-status.enum.ts";
import type { Dimension } from "#/types/filesystem/dimension.type.ts";
import type { ObjectKey } from "#/types/filesystem/object-key.type.ts";
import type { Seconds } from "#/types/filesystem/seconds.type.ts";
import type { ByteCount } from "#/types/shared/byte-count.type.ts";
import type { Checksum } from "#/types/shared/checksum.type.ts";
import type { Id } from "#/types/shared/id.type.ts";
import type { Version } from "#/types/shared/version.type.ts";
import type { Store } from "#/types/filesystem/store.interface.ts";
import type { BaseEntity } from "#/types/shared/base-entity.interface.ts";
import type { DateTime } from "#/types/shared/date-time.type.ts";

/** Stored Object */
export interface StoredObject {
  contentHash: Checksum;
  createdAt: DateTime;
  durationSeconds?: Seconds | null;
  formatId?: Id | null;
  id: Id;
  mediaHeight?: Dimension | null;
  mediaWidth?: Dimension | null;
  objectKey: ObjectKey;
  pageCount?: Dimension | null;
  scanStatus: ScanStatus;
  sizeBytes: ByteCount;
  storeId: Id;
  updatedAt: DateTime;
  version: Version;
}