
import type { SortDirection } from "#/types/shared/sort-direction.enum.ts";
import type { ClassificationScheme } from "#/types/reference/classification-scheme.type.ts";
import type { BusinessCode } from "#/types/shared/business-code.type.ts";
import type { Flag } from "#/types/shared/flag.type.ts";
import type { Id } from "#/types/shared/id.type.ts";
import type { PaginationNumber } from "#/types/shared/pagination-number.type.ts";
import type { BaseQuery } from "#/types/shared/base-query.interface.ts";

/** Classification Record List Query */
export interface ClassificationRecordListQuery {
  code?: BusinessCode;
  includeHistory?: Flag;
  jurisdictionId?: Id;
  limit?: PaginationNumber;
  order?: SortDirection;
  page?: PaginationNumber;
  scheme?: ClassificationScheme;
  sort?: SortDirection;
}