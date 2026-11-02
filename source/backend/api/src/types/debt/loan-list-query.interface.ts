
import type { LoanStatus } from "#/types/debt/loan-status.enum.ts";
import type { SortDirection } from "#/types/shared/sort-direction.enum.ts";
import type { Flag } from "#/types/shared/flag.type.ts";
import type { Id } from "#/types/shared/id.type.ts";
import type { PaginationNumber } from "#/types/shared/pagination-number.type.ts";
import type { BaseQuery } from "#/types/shared/base-query.interface.ts";

/** Loan List Query */
export interface LoanListQuery {
  borrowerUnitId?: Id;
  includeHistory?: Flag;
  lenderEntityId?: Id;
  limit?: PaginationNumber;
  order?: SortDirection;
  page?: PaginationNumber;
  sort?: SortDirection;
  status?: LoanStatus;
}