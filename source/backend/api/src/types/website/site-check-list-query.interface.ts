
import type { SortDirection } from "#/types/shared/sort-direction.enum.ts";
import type { CheckKind } from "#/types/website/check-kind.enum.ts";
import type { CheckOutcome } from "#/types/website/check-outcome.enum.ts";
import type { Flag } from "#/types/shared/flag.type.ts";
import type { Id } from "#/types/shared/id.type.ts";
import type { PaginationNumber } from "#/types/shared/pagination-number.type.ts";
import type { BaseQuery } from "#/types/shared/base-query.interface.ts";

/** Site Check List Query */
export interface SiteCheckListQuery {
  includeHistory?: Flag;
  kind?: CheckKind;
  limit?: PaginationNumber;
  order?: SortDirection;
  outcome?: CheckOutcome;
  page?: PaginationNumber;
  siteId?: Id;
  sort?: SortDirection;
}