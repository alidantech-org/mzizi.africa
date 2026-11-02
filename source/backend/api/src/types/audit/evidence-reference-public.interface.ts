
import type { Description } from "#/types/shared/description.type.ts";
import type { Id } from "#/types/shared/id.type.ts";
import type { TargetKind } from "#/types/shared/target-kind.type.ts";
import type { Version } from "#/types/shared/version.type.ts";
import type { DateTime } from "#/types/shared/date-time.type.ts";

/** Evidence Reference Public */
export interface EvidenceReferencePublic {
  actorId: Id;
  createdAt: DateTime;
  fileId: Id;
  id: Id;
  note?: Description | null;
  targetId: Id;
  targetKind: TargetKind;
  updatedAt: DateTime;
  version: Version;
}