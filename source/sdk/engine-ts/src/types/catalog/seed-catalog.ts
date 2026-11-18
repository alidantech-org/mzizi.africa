import type { CatalogSeedTable } from "#sdk/types/catalog/seed-table.ts";

/** Seed Catalog */
export interface CatalogSeedCatalog {
  sha256: string;
  tables: CatalogSeedTable[];
}
