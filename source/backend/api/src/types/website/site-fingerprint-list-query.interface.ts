
import type { SortDirection } from "#/types/shared/sort-direction.enum.ts";
import type { FingerprintKind } from "#/types/website/fingerprint-kind.enum.ts";
import type { Flag } from "#/types/shared/flag.type.ts";
import type { Id } from "#/types/shared/id.type.ts";
import type { PaginationNumber } from "#/types/shared/pagination-number.type.ts";
import type { BaseQuery } from "#/types/shared/base-query.interface.ts";

/** Site Fingerprint List Query */
export interface SiteFingerprintListQuery {
  includeHistory?: Flag;
  kind?: FingerprintKind;
  limit?: PaginationNumber;
  order?: SortDirection;
  page?: PaginationNumber;
  siteId?: Id;
  sort?: SortDirection;
}