
import type { LegalInstrumentPublic } from "#/types/legal/legal-instrument-public.interface.ts";
import type { PaginatedResponse } from "#/types/shared/paginated-response.interface.ts";
import type { PaginationMeta } from "#/types/shared/pagination-meta.interface.ts";

/** Legal Instruments List Response */
export interface LegalInstrumentsListResponse {
  instruments: LegalInstrumentPublic[];
  meta: PaginationMeta;
}