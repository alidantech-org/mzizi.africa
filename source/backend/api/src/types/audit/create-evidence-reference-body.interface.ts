
import type { MediaType } from "#/types/audit/media-type.type.ts";
import type { SizeBytes } from "#/types/audit/size-bytes.type.ts";
import type { Checksum } from "#/types/shared/checksum.type.ts";
import type { Description } from "#/types/shared/description.type.ts";
import type { Id } from "#/types/shared/id.type.ts";
import type { TargetKind } from "#/types/shared/target-kind.type.ts";

/** Create Evidence Reference Body */
export interface CreateEvidenceReferenceBody {
  artifactChecksum: Checksum;
  artifactId: Id;
  mediaType: MediaType;
  note?: Description | null;
  sizeBytes: SizeBytes;
  targetId: Id;
  targetKind: TargetKind;
}