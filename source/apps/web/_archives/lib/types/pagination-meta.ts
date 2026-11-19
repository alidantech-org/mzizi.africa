import type { FieldMeta } from "#/_archives/lib/dryv/transport";

/** Pagination Meta */
export interface PaginationMeta {
  limit: number;
  page: number;
  total: number;
  totalPages: number;
}

/** Field metadata for forms and results. */
export const PaginationMetaFields: readonly FieldMeta[] = [
  { name: "limit", label: "Limit", kind: "number", required: true },
  { name: "page", label: "Page", kind: "number", required: true },
  { name: "total", label: "Total", kind: "number", required: true },
  { name: "totalPages", label: "Total Pages", kind: "number", required: true },
];
