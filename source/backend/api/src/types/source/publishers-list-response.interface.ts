
import type { PaginatedResponse } from "#/types/shared/paginated-response.interface.ts";
import type { PaginationMeta } from "#/types/shared/pagination-meta.interface.ts";
import type { PublisherPublic } from "#/types/source/publisher-public.interface.ts";

/** Publishers List Response */
export interface PublishersListResponse {
  meta: PaginationMeta;
  publishers: PublisherPublic[];
}