
import type { SortDirection } from "#/modules/shared/enum/sort-direction.enum.ts";
import type { NonNegativeInteger } from "#/modules/shared/type/non-negative-integer.type.ts";
import type { StatusCode } from "#/modules/shared/type/status-code.type.ts";

/** Base Query */
export interface BaseQuery {
  limit?: NonNegativeInteger;
  order?: SortDirection;
  page?: NonNegativeInteger;
  sort?: StatusCode;
}