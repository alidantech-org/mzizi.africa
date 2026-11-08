
import type { PaginatedResponse } from "#/types/shared/paginated-response.interface.ts";
import type { PaginationMeta } from "#/types/shared/pagination-meta.interface.ts";
import type { SiteSubjectPublic } from "#/types/website/site-subject-public.interface.ts";

/** Site Subjects List Response */
export interface SiteSubjectsListResponse {
  meta: PaginationMeta;
  siteSubjects: SiteSubjectPublic[];
}