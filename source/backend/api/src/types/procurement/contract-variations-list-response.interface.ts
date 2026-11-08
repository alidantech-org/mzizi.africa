
import type { ContractVariationPublic } from "#/types/procurement/contract-variation-public.interface.ts";
import type { PaginatedResponse } from "#/types/shared/paginated-response.interface.ts";
import type { PaginationMeta } from "#/types/shared/pagination-meta.interface.ts";

/** Contract Variations List Response */
export interface ContractVariationsListResponse {
  meta: PaginationMeta;
  variations: ContractVariationPublic[];
}