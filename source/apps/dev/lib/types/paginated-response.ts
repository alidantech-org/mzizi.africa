import type { FieldMeta } from "#/lib/dryv/transport.ts";
import { type PaginationMeta } from "#/lib/types/pagination-meta.ts";

/** Paginated Response */
export interface PaginatedResponse {
  meta: PaginationMeta;
}

/** Field metadata for forms and results. */
export const PaginatedResponseFields: readonly FieldMeta[] = [
  { name: "meta", label: "Meta", kind: "other", required: true },
];
