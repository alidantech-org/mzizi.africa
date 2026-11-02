
import type { InstitutionPublic } from "#/types/governance/institution-public.interface.ts";
import type { PaginatedResponse } from "#/types/shared/paginated-response.interface.ts";
import type { PaginationMeta } from "#/types/shared/pagination-meta.interface.ts";

/** Institutions List Response */
export interface InstitutionsListResponse {
  institutions: InstitutionPublic[];
  meta: PaginationMeta;
}