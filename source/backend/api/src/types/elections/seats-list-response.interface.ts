
import type { SeatPublic } from "#/types/elections/seat-public.interface.ts";
import type { PaginatedResponse } from "#/types/shared/paginated-response.interface.ts";
import type { PaginationMeta } from "#/types/shared/pagination-meta.interface.ts";

/** Seats List Response */
export interface SeatsListResponse {
  meta: PaginationMeta;
  seats: SeatPublic[];
}