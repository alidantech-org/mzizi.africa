import type { FieldMeta } from "#/lib/dryv/transport.ts";
import { type ColumnInfo } from "#/lib/types/column-info.ts";

/** Table Page */
export interface TablePage {
  columns: ColumnInfo[];
  direction: string;
  domain: string;
  limit: number;
  offset: number;
  order: string;
  rows: unknown[];
  search: string;
  table: string;
  total: number;
}

/** Field metadata for forms and results. */
export const TablePageFields: readonly FieldMeta[] = [
  { name: "columns", label: "Columns", kind: "other", required: true },
  { name: "direction", label: "Direction", kind: "string", required: true },
  { name: "domain", label: "Domain", kind: "string", required: true },
  { name: "limit", label: "Limit", kind: "number", required: true },
  { name: "offset", label: "Offset", kind: "number", required: true },
  { name: "order", label: "Order", kind: "string", required: true },
  { name: "rows", label: "Rows", kind: "other", required: true },
  { name: "search", label: "Search", kind: "string", required: true },
  { name: "table", label: "Table", kind: "string", required: true },
  { name: "total", label: "Total", kind: "number", required: true },
];
