import type { FieldMeta } from "#/lib/dryv/transport.ts";
import { type DataList } from "#/lib/types/data-list.ts";

/** Data List Page */
export interface DataListPage {
  definition: DataList;
  limit: number;
  offset: number;
  rows: unknown[];
  total: number;
}

/** Field metadata for forms and results. */
export const DataListPageFields: readonly FieldMeta[] = [
  { name: "definition", label: "Definition", kind: "other", required: true },
  { name: "limit", label: "Limit", kind: "number", required: true },
  { name: "offset", label: "Offset", kind: "number", required: true },
  { name: "rows", label: "Rows", kind: "other", required: true },
  { name: "total", label: "Total", kind: "number", required: true },
];
