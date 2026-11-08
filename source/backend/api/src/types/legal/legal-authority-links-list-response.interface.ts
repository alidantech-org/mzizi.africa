
import type { LegalAuthorityLinkPublic } from "#/types/legal/legal-authority-link-public.interface.ts";
import type { PaginatedResponse } from "#/types/shared/paginated-response.interface.ts";
import type { PaginationMeta } from "#/types/shared/pagination-meta.interface.ts";

/** Legal Authority Links List Response */
export interface LegalAuthorityLinksListResponse {
  links: LegalAuthorityLinkPublic[];
  meta: PaginationMeta;
}