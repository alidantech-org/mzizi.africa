import type { FieldMeta } from "#/lib/dryv/transport.ts";

/** Prepare Result */
export interface PrepareResult {
  droppedRows: number;
  header: string[];
  problems: string[];
  rows: unknown[];
  saved: string;
  totalRows: number;
}

/** Field metadata for forms and results. */
export const PrepareResultFields: readonly FieldMeta[] = [
  { name: "droppedRows", label: "Dropped Rows", kind: "number", required: true },
  { name: "header", label: "Header", kind: "string", required: true },
  { name: "problems", label: "Problems", kind: "string", required: true },
  { name: "rows", label: "Rows", kind: "other", required: true },
  { name: "saved", label: "Saved", kind: "string", required: true },
  { name: "totalRows", label: "Total Rows", kind: "number", required: true },
];
