import type { FieldMeta } from "#/lib/dryv/transport.ts";
import { type SeedColumn } from "#/lib/types/seed-column.ts";

/** Seed Table */
export interface SeedTable {
  columns: SeedColumn[];
  name: string;
  naturalKey: string[];
}

/** Field metadata for forms and results. */
export const SeedTableFields: readonly FieldMeta[] = [
  { name: "columns", label: "Columns", kind: "other", required: true },
  { name: "name", label: "Name", kind: "string", required: true },
  { name: "naturalKey", label: "Natural Key", kind: "string", required: true },
];
