
import type { ContractMilestonePublic } from "#/types/procurement/contract-milestone-public.interface.ts";
import type { PaginatedResponse } from "#/types/shared/paginated-response.interface.ts";
import type { PaginationMeta } from "#/types/shared/pagination-meta.interface.ts";

/** Contract Milestones List Response */
export interface ContractMilestonesListResponse {
  meta: PaginationMeta;
  milestones: ContractMilestonePublic[];
}