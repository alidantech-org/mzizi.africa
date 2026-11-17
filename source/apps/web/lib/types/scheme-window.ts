import type { FieldMeta } from "#/lib/dryv/transport.ts";

/** Scheme Window */
export interface SchemeWindow {
  code?: string;
  limit?: number;
  offset?: number;
}

/** Field metadata for forms and results. */
export const SchemeWindowFields: readonly FieldMeta[] = [
  { name: "code", label: "Code", kind: "string", required: false },
  { name: "limit", label: "Limit", kind: "number", required: false },
  { name: "offset", label: "Offset", kind: "number", required: false },
];
