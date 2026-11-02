
import type { MediaType } from "#/types/audit/media-type.type.ts";
import type { SizeBytes } from "#/types/audit/size-bytes.type.ts";
import type { Checksum } from "#/types/shared/checksum.type.ts";
import type { Description } from "#/types/shared/description.type.ts";
import type { Id } from "#/types/shared/id.type.ts";
import type { TargetKind } from "#/types/shared/target-kind.type.ts";
import type { Version } from "#/types/shared/version.type.ts";
import type { BaseEntity } from "#/types/shared/base-entity.interface.ts";
import type { DateTime } from "#/types/shared/date-time.type.ts";

/** Evidence Reference */
export interface EvidenceReference {
  actorId: Id;
  artifactChecksum: Checksum;
  artifactId: Id;
  createdAt: DateTime;
  id: Id;
  mediaType: MediaType;
  note?: Description | null;
  sizeBytes: SizeBytes;
  targetId: Id;
  targetKind: TargetKind;
  updatedAt: DateTime;
  version: Version;
}