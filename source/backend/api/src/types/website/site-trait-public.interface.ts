
import type { RelationOwnerKind } from "#/types/website/relation-owner-kind.enum.ts";
import type { Confidence } from "#/types/shared/confidence.type.ts";
import type { Id } from "#/types/shared/id.type.ts";
import type { Version } from "#/types/shared/version.type.ts";
import type { TraitTag } from "#/types/website/trait-tag.type.ts";
import type { DateTime } from "#/types/shared/date-time.type.ts";

/** Site Trait Public */
export interface SiteTraitPublic {
  createdAt: DateTime;
  id: Id;
  methodId?: Id | null;
  observedAt?: DateTime | null;
  ownerId: Id;
  ownerKind: RelationOwnerKind;
  score?: Confidence | null;
  tag: TraitTag;
  updatedAt: DateTime;
  version: Version;
}