
import type { LegalEntityPublic } from "#/types/entities/legal-entity-public.interface.ts";
import type { PaginatedResponse } from "#/types/shared/paginated-response.interface.ts";
import type { PaginationMeta } from "#/types/shared/pagination-meta.interface.ts";

/** Legal Entities List Response */
export interface LegalEntitiesListResponse {
  entities: LegalEntityPublic[];
  meta: PaginationMeta;
}