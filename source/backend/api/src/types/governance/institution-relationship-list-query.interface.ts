
import type { RelationshipKind } from "#/types/governance/relationship-kind.enum.ts";
import type { SortDirection } from "#/types/shared/sort-direction.enum.ts";
import type { Flag } from "#/types/shared/flag.type.ts";
import type { Id } from "#/types/shared/id.type.ts";
import type { PaginationNumber } from "#/types/shared/pagination-number.type.ts";
import type { TargetKind } from "#/types/shared/target-kind.type.ts";
import type { BaseQuery } from "#/types/shared/base-query.interface.ts";

/** Institution Relationship List Query */
export interface InstitutionRelationshipListQuery {
  includeHistory?: Flag;
  kind?: RelationshipKind;
  limit?: PaginationNumber;
  objectId?: Id;
  objectKind?: TargetKind;
  order?: SortDirection;
  page?: PaginationNumber;
  sort?: SortDirection;
  subjectId?: Id;
  subjectKind?: TargetKind;
}