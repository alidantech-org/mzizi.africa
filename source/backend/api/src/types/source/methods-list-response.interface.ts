
import type { PaginatedResponse } from "#/types/shared/paginated-response.interface.ts";
import type { PaginationMeta } from "#/types/shared/pagination-meta.interface.ts";
import type { MethodPublic } from "#/types/source/method-public.interface.ts";

/** Methods List Response */
export interface MethodsListResponse {
  meta: PaginationMeta;
  methods: MethodPublic[];
}