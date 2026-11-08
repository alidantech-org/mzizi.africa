
import type { SortDirection } from "#/types/shared/sort-direction.enum.ts";
import type { CandidateStatusFilter } from "#/types/pipeline/candidate-status-filter.type.ts";
import type { TargetKind } from "#/types/pipeline/target-kind.type.ts";
import type { Flag } from "#/types/shared/flag.type.ts";
import type { Id } from "#/types/shared/id.type.ts";
import type { PaginationNumber } from "#/types/shared/pagination-number.type.ts";
import type { BaseQuery } from "#/types/shared/base-query.interface.ts";

/** Candidate List Query */
export interface CandidateListQuery {
  includeHistory?: Flag;
  limit?: PaginationNumber;
  order?: SortDirection;
  page?: PaginationNumber;
  runId?: Id;
  sort?: SortDirection;
  status?: CandidateStatusFilter;
  targetKind?: TargetKind;
}