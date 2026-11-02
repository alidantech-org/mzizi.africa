
import type { EventLinkPublic } from "#/types/events/event-link-public.interface.ts";
import type { PaginatedResponse } from "#/types/shared/paginated-response.interface.ts";
import type { PaginationMeta } from "#/types/shared/pagination-meta.interface.ts";

/** Event Links List Response */
export interface EventLinksListResponse {
  links: EventLinkPublic[];
  meta: PaginationMeta;
}