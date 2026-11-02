
import type { ManifestoPublic } from "#/types/elections/manifesto-public.interface.ts";
import type { PaginatedResponse } from "#/types/shared/paginated-response.interface.ts";
import type { PaginationMeta } from "#/types/shared/pagination-meta.interface.ts";

/** Manifestos List Response */
export interface ManifestosListResponse {
  manifestos: ManifestoPublic[];
  meta: PaginationMeta;
}