
import type { MembershipBasis } from "#/types/website/membership-basis.enum.ts";
import type { RelationOwnerKind } from "#/types/website/relation-owner-kind.enum.ts";
import type { SiteRelationKind } from "#/types/website/site-relation-kind.enum.ts";
import type { Id } from "#/types/shared/id.type.ts";
import type { LongText } from "#/types/shared/long-text.type.ts";
import type { Version } from "#/types/shared/version.type.ts";
import type { Score } from "#/types/website/score.type.ts";
import type { BaseEntity } from "#/types/shared/base-entity.interface.ts";
import type { DateTime } from "#/types/shared/date-time.type.ts";

/** Site Relation */
export interface SiteRelation {
  basis: MembershipBasis;
  createdAt: DateTime;
  evidence?: LongText | null;
  fromId: Id;
  fromKind: RelationOwnerKind;
  id: Id;
  relation: SiteRelationKind;
  score?: Score | null;
  toId: Id;
  toKind: RelationOwnerKind;
  updatedAt: DateTime;
  version: Version;
}