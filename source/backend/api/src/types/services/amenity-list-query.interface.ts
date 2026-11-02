
import type { SortDirection } from "#/types/shared/sort-direction.enum.ts";
import type { Flag } from "#/types/shared/flag.type.ts";
import type { Id } from "#/types/shared/id.type.ts";
import type { Name } from "#/types/shared/name.type.ts";
import type { PaginationNumber } from "#/types/shared/pagination-number.type.ts";
import type { BaseQuery } from "#/types/shared/base-query.interface.ts";

/** Amenity List Query */
export interface AmenityListQuery {
  geoUnitId?: Id;
  includeHistory?: Flag;
  jurisdictionId?: Id;
  limit?: PaginationNumber;
  order?: SortDirection;
  page?: PaginationNumber;
  q?: Name;
  sectorId?: Id;
  sort?: SortDirection;
}