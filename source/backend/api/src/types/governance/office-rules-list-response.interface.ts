
import type { OfficeRulePublic } from "#/types/governance/office-rule-public.interface.ts";
import type { PaginatedResponse } from "#/types/shared/paginated-response.interface.ts";
import type { PaginationMeta } from "#/types/shared/pagination-meta.interface.ts";

/** Office Rules List Response */
export interface OfficeRulesListResponse {
  meta: PaginationMeta;
  rules: OfficeRulePublic[];
}