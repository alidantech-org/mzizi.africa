import type { FieldMeta } from "#/_archives/lib/dryv/transport";
import { type PaginationMeta } from "#/_archives/lib/types/pagination-meta";

/** Paginated Response */
export interface PaginatedResponse {
  meta: PaginationMeta;
}

/** Field metadata for forms and results. */
export const PaginatedResponseFields: readonly FieldMeta[] = [
  { name: "meta", label: "Meta", kind: "other", required: true },
];
