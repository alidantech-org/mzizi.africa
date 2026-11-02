
import type { ManifestoCommitmentPublic } from "#/types/elections/manifesto-commitment-public.interface.ts";
import type { PaginatedResponse } from "#/types/shared/paginated-response.interface.ts";
import type { PaginationMeta } from "#/types/shared/pagination-meta.interface.ts";

/** Manifesto Commitments List Response */
export interface ManifestoCommitmentsListResponse {
  commitments: ManifestoCommitmentPublic[];
  meta: PaginationMeta;
}