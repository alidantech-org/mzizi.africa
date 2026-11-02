
import type { LedgerEntryPublic } from "#/types/finance/ledger-entry-public.interface.ts";
import type { PaginatedResponse } from "#/types/shared/paginated-response.interface.ts";
import type { PaginationMeta } from "#/types/shared/pagination-meta.interface.ts";

/** Ledger Entries List Response */
export interface LedgerEntriesListResponse {
  entries: LedgerEntryPublic[];
  meta: PaginationMeta;
}