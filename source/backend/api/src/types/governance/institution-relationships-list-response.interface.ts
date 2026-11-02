
import type { InstitutionRelationshipPublic } from "#/types/governance/institution-relationship-public.interface.ts";
import type { PaginatedResponse } from "#/types/shared/paginated-response.interface.ts";
import type { PaginationMeta } from "#/types/shared/pagination-meta.interface.ts";

/** Institution Relationships List Response */
export interface InstitutionRelationshipsListResponse {
  meta: PaginationMeta;
  relationships: InstitutionRelationshipPublic[];
}