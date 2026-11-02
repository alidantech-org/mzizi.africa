
import type { SortDirection } from "#/types/shared/sort-direction.enum.ts";
import type { RelationOwnerKind } from "#/types/website/relation-owner-kind.enum.ts";
import type { Flag } from "#/types/shared/flag.type.ts";
import type { Id } from "#/types/shared/id.type.ts";
import type { PaginationNumber } from "#/types/shared/pagination-number.type.ts";
import type { TraitTag } from "#/types/website/trait-tag.type.ts";
import type { BaseQuery } from "#/types/shared/base-query.interface.ts";

/** Site Trait List Query */
export interface SiteTraitListQuery {
  includeHistory?: Flag;
  limit?: PaginationNumber;
  order?: SortDirection;
  ownerId?: Id;
  ownerKind?: RelationOwnerKind;
  page?: PaginationNumber;
  sort?: SortDirection;
  tag?: TraitTag;
}