import type { FieldMeta } from "#/lib/dryv/transport.ts";

/** Table Info */
export interface TableInfo {
  columns: number;
  describe: string;
  name: string;
  rows: number;
}

/** Field metadata for forms and results. */
export const TableInfoFields: readonly FieldMeta[] = [
  { name: "columns", label: "Columns", kind: "number", required: true },
  { name: "describe", label: "Describe", kind: "string", required: true },
  { name: "name", label: "Name", kind: "string", required: true },
  { name: "rows", label: "Rows", kind: "number", required: true },
];
