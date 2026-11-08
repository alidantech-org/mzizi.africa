
import type { PaginatedResponse } from "#/types/shared/paginated-response.interface.ts";
import type { PaginationMeta } from "#/types/shared/pagination-meta.interface.ts";
import type { DomainPatternPublic } from "#/types/website/domain-pattern-public.interface.ts";

/** Domain Patterns List Response */
export interface DomainPatternsListResponse {
  domainPatterns: DomainPatternPublic[];
  meta: PaginationMeta;
}