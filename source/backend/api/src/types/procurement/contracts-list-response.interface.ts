
import type { ContractPublic } from "#/types/procurement/contract-public.interface.ts";
import type { PaginatedResponse } from "#/types/shared/paginated-response.interface.ts";
import type { PaginationMeta } from "#/types/shared/pagination-meta.interface.ts";

/** Contracts List Response */
export interface ContractsListResponse {
  contracts: ContractPublic[];
  meta: PaginationMeta;
}