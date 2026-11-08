
import type { StructureOwnerKind } from "#/types/website/structure-owner-kind.enum.ts";
import type { StructureStatus } from "#/types/website/structure-status.enum.ts";
import type { Id } from "#/types/shared/id.type.ts";
import type { Version } from "#/types/shared/version.type.ts";
import type { Purpose } from "#/types/website/purpose.type.ts";
import type { BaseEntity } from "#/types/shared/base-entity.interface.ts";
import type { DateTime } from "#/types/shared/date-time.type.ts";

/** Structure */
export interface Structure {
  createdAt: DateTime;
  currentVersionId?: Id | null;
  id: Id;
  ownerId: Id;
  ownerKind: StructureOwnerKind;
  purpose: Purpose;
  status: StructureStatus;
  updatedAt: DateTime;
  version: Version;
}