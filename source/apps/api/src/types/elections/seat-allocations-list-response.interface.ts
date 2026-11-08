
import type { SeatAllocationPublic } from "#/types/elections/seat-allocation-public.interface.ts";
import type { PaginatedResponse } from "#/types/shared/paginated-response.interface.ts";
import type { PaginationMeta } from "#/types/shared/pagination-meta.interface.ts";

/** Seat Allocations List Response */
export interface SeatAllocationsListResponse {
  allocations: SeatAllocationPublic[];
  meta: PaginationMeta;
}