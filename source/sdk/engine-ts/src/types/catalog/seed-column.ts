/** Seed Column */
export interface CatalogSeedColumn {
  kind: string;
  name: string;
  required: boolean;
  targetColumn?: string | null;
  targetTable?: string | null;
}
