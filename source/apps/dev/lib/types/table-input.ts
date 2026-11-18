import type { FieldMeta } from "#/lib/dryv/transport.ts";

/** Table Input */
export interface TableInput {
  direction?: string;
  domain: string;
  limit?: number;
  offset?: number;
  order?: string;
  q?: string;
  table: string;
}

/** Field metadata for forms and results. */
export const TableInputFields: readonly FieldMeta[] = [
  { name: "direction", label: "Direction", kind: "string", required: false },
  { name: "domain", label: "Domain", kind: "string", required: true },
  { name: "limit", label: "Limit", kind: "number", required: false },
  { name: "offset", label: "Offset", kind: "number", required: false },
  { name: "order", label: "Order", kind: "string", required: false },
  { name: "q", label: "Q", kind: "string", required: false },
  { name: "table", label: "Table", kind: "string", required: true },
];
