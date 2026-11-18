import type { CatalogSeedColumn } from "#sdk/types/catalog/seed-column.ts";

/** Seed Table */
export interface CatalogSeedTable {
  columns: CatalogSeedColumn[];
  name: string;
  naturalKey: string[];
}
