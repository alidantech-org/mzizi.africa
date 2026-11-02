
import type { PaginatedResponse } from "#/types/shared/paginated-response.interface.ts";
import type { PaginationMeta } from "#/types/shared/pagination-meta.interface.ts";
import type { ObservationDerivationPublic } from "#/types/statistics/observation-derivation-public.interface.ts";

/** Observation Derivations List Response */
export interface ObservationDerivationsListResponse {
  derivations: ObservationDerivationPublic[];
  meta: PaginationMeta;
}