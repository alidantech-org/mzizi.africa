import type { FieldMeta } from "#/lib/dryv/transport.ts";

/** Seed Catalog Query */
export interface SeedCatalogQuery {
  table?: string;
}

/** Field metadata for forms and results. */
export const SeedCatalogQueryFields: readonly FieldMeta[] = [
  { name: "table", label: "Table", kind: "string", required: false },
];
