import type { FieldMeta } from "#/lib/dryv/transport.ts";

/** List Input */
export interface ListInput {
  code: string;
  domain: string;
  limit?: number;
  offset?: number;
}

/** Field metadata for forms and results. */
export const ListInputFields: readonly FieldMeta[] = [
  { name: "code", label: "Code", kind: "string", required: true },
  { name: "domain", label: "Domain", kind: "string", required: true },
  { name: "limit", label: "Limit", kind: "number", required: false },
  { name: "offset", label: "Offset", kind: "number", required: false },
];
