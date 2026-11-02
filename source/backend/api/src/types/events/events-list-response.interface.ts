
import type { EventPublic } from "#/types/events/event-public.interface.ts";
import type { PaginatedResponse } from "#/types/shared/paginated-response.interface.ts";
import type { PaginationMeta } from "#/types/shared/pagination-meta.interface.ts";

/** Events List Response */
export interface EventsListResponse {
  events: EventPublic[];
  meta: PaginationMeta;
}