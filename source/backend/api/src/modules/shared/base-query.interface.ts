
import type { SortDirection } from "#/modules/shared/sort-direction.enum.ts";
import type { NonNegativeInteger } from "#/modules/shared/non-negative-integer.type.ts";
import type { StatusCode } from "#/modules/shared/status-code.type.ts";

/** Base Query */
export interface BaseQuery {
  limit?: NonNegativeInteger;
  order?: SortDirection;
  page?: NonNegativeInteger;
  sort?: StatusCode;
}