
import type { Flag } from "#/types/shared/flag.type.ts";
import type { Id } from "#/types/shared/id.type.ts";
import type { Name } from "#/types/shared/name.type.ts";
import type { PaginationNumber } from "#/types/shared/pagination-number.type.ts";

/** Office Holder Search Query */
export interface OfficeHolderSearchQuery {
  county?: Name;
  current?: Flag;
  institution?: Name;
  institutionId?: Id;
  limit?: PaginationNumber;
  office?: Name;
  officeId?: Id;
  page?: PaginationNumber;
  party?: Name;
  personId?: Id;
  q?: Name;
}