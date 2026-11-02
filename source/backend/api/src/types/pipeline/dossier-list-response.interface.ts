
import type { DossierSummary } from "#/types/pipeline/dossier-summary.interface.ts";
import type { PaginatedResponse } from "#/types/shared/paginated-response.interface.ts";
import type { PaginationMeta } from "#/types/shared/pagination-meta.interface.ts";

/** Dossier List Response */
export interface DossierListResponse {
  dossiers: DossierSummary[];
  meta: PaginationMeta;
}