
import type { ProcurementContractPublic } from "#/types/procurement/procurement-contract-public.interface.ts";
import type { PaginatedResponse } from "#/types/shared/paginated-response.interface.ts";
import type { PaginationMeta } from "#/types/shared/pagination-meta.interface.ts";

/** Procurement Contracts List Response */
export interface ProcurementContractsListResponse {
  contracts: ProcurementContractPublic[];
  meta: PaginationMeta;
}