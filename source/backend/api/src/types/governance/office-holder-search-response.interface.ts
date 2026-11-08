
import type { PaginationNumber } from "#/types/shared/pagination-number.type.ts";
import type { OfficeHolderSearchItem } from "#/types/governance/office-holder-search-item.interface.ts";

/** Office Holder Search Response */
export interface OfficeHolderSearchResponse {
  limit: PaginationNumber;
  page: PaginationNumber;
  results: OfficeHolderSearchItem[];
  total: PaginationNumber;
}