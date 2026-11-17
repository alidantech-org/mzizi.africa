import type { FieldMeta } from "#/lib/dryv/transport.ts";

/** Source Search Input */
export interface SourceSearchInput {
  limit?: number;
  query?: string;
}

/** Field metadata for forms and results. */
export const SourceSearchInputFields: readonly FieldMeta[] = [
  { name: "limit", label: "Limit", kind: "number", required: false },
  { name: "query", label: "Query", kind: "string", required: false },
];
