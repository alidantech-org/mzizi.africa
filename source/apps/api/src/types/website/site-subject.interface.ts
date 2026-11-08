
import type { SubjectRelation } from "#/types/website/subject-relation.enum.ts";
import type { Id } from "#/types/shared/id.type.ts";
import type { TargetKind } from "#/types/shared/target-kind.type.ts";
import type { Version } from "#/types/shared/version.type.ts";
import type { BaseEntity } from "#/types/shared/base-entity.interface.ts";
import type { Site } from "#/types/website/site.interface.ts";
import type { DateTime } from "#/types/shared/date-time.type.ts";
import type { Date } from "#/types/shared/date.type.ts";

/** Site Subject */
export interface SiteSubject {
  createdAt: DateTime;
  id: Id;
  relation: SubjectRelation;
  siteId: Id;
  targetId: Id;
  targetKind: TargetKind;
  updatedAt: DateTime;
  validFrom?: Date | null;
  validTo?: Date | null;
  version: Version;
}