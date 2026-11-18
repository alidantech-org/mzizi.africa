import type { FieldMeta } from "#/lib/dryv/transport.ts";

/** Data List */
export interface DataList {
  code: string;
  columns: string[];
  describe: string;
  domain: string;
  sql: string;
  title: string;
}

/** Field metadata for forms and results. */
export const DataListFields: readonly FieldMeta[] = [
  { name: "code", label: "Code", kind: "string", required: true },
  { name: "columns", label: "Columns", kind: "string", required: true },
  { name: "describe", label: "Describe", kind: "string", required: true },
  { name: "domain", label: "Domain", kind: "string", required: true },
  { name: "sql", label: "Sql", kind: "string", required: true },
  { name: "title", label: "Title", kind: "string", required: true },
];
