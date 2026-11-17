import type { FieldMeta } from "#/lib/dryv/transport.ts";
import { type SeedTable } from "#/lib/types/seed-table.ts";

/** Seed Catalog */
export interface SeedCatalog {
  sha256: string;
  tables: SeedTable[];
}

/** Field metadata for forms and results. */
export const SeedCatalogFields: readonly FieldMeta[] = [
  { name: "sha256", label: "Sha256", kind: "string", required: true },
  { name: "tables", label: "Tables", kind: "other", required: true },
];
