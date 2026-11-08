
import type { TransferPublic } from "#/types/finance/transfer-public.interface.ts";
import type { PaginatedResponse } from "#/types/shared/paginated-response.interface.ts";
import type { PaginationMeta } from "#/types/shared/pagination-meta.interface.ts";

/** Transfers List Response */
export interface TransfersListResponse {
  meta: PaginationMeta;
  transfers: TransferPublic[];
}