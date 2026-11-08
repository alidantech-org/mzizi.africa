
import type { IdeologyPublic } from "#/types/political/ideology-public.interface.ts";
import type { PaginatedResponse } from "#/types/shared/paginated-response.interface.ts";
import type { PaginationMeta } from "#/types/shared/pagination-meta.interface.ts";

/** Ideologies List Response */
export interface IdeologiesListResponse {
  ideologies: IdeologyPublic[];
  meta: PaginationMeta;
}