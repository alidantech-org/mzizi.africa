import type { FieldMeta } from "#/lib/dryv/transport.ts";

/** Page Window */
export interface PageWindow {
  limit?: number;
  offset?: number;
}

/** Field metadata for forms and results. */
export const PageWindowFields: readonly FieldMeta[] = [
  { name: "limit", label: "Limit", kind: "number", required: false },
  { name: "offset", label: "Offset", kind: "number", required: false },
];
