
import type { InstrumentStatus } from "#/types/legal/instrument-status.enum.ts";
import type { SortDirection } from "#/types/shared/sort-direction.enum.ts";
import type { Id } from "#/types/shared/id.type.ts";
import type { Name } from "#/types/shared/name.type.ts";
import type { PaginationNumber } from "#/types/shared/pagination-number.type.ts";
import type { BaseQuery } from "#/types/shared/base-query.interface.ts";

/** Legal Instrument List Query */
export interface LegalInstrumentListQuery {
  jurisdictionId?: Id;
  limit?: PaginationNumber;
  order?: SortDirection;
  page?: PaginationNumber;
  q?: Name;
  sort?: SortDirection;
  status?: InstrumentStatus;
}