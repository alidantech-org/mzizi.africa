
import type { SortDirection } from "#/types/shared/sort-direction.enum.ts";
import type { ConfidenceLevel } from "#/types/statistics/confidence-level.enum.ts";
import type { Flag } from "#/types/shared/flag.type.ts";
import type { Id } from "#/types/shared/id.type.ts";
import type { PaginationNumber } from "#/types/shared/pagination-number.type.ts";
import type { BaseQuery } from "#/types/shared/base-query.interface.ts";

/** Observation List Query */
export interface ObservationListQuery {
  confidenceLevel?: ConfidenceLevel;
  geoUnitId?: Id;
  includeHistory?: Flag;
  indicatorId?: Id;
  limit?: PaginationNumber;
  order?: SortDirection;
  page?: PaginationNumber;
  periodId?: Id;
  sort?: SortDirection;
  tableId?: Id;
}