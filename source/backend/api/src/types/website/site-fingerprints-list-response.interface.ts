
import type { PaginatedResponse } from "#/types/shared/paginated-response.interface.ts";
import type { PaginationMeta } from "#/types/shared/pagination-meta.interface.ts";
import type { SiteFingerprintPublic } from "#/types/website/site-fingerprint-public.interface.ts";

/** Site Fingerprints List Response */
export interface SiteFingerprintsListResponse {
  meta: PaginationMeta;
  siteFingerprints: SiteFingerprintPublic[];
}