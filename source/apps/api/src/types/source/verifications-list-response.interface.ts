
import type { PaginatedResponse } from "#/types/shared/paginated-response.interface.ts";
import type { PaginationMeta } from "#/types/shared/pagination-meta.interface.ts";
import type { VerificationPublic } from "#/types/source/verification-public.interface.ts";

/** Verifications List Response */
export interface VerificationsListResponse {
  meta: PaginationMeta;
  verifications: VerificationPublic[];
}