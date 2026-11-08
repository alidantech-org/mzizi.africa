
import type { EvidenceReferencePublic } from "#/types/audit/evidence-reference-public.interface.ts";
import type { PaginatedResponse } from "#/types/shared/paginated-response.interface.ts";
import type { PaginationMeta } from "#/types/shared/pagination-meta.interface.ts";

/** Evidence References List Response */
export interface EvidenceReferencesListResponse {
  evidenceReferences: EvidenceReferencePublic[];
  meta: PaginationMeta;
}