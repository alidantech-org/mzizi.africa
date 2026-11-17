import type { FieldMeta } from "#/lib/dryv/transport.ts";

/** Base for operational records: identity only. */
export interface Identified {
  id: string;
}

/** Field metadata for forms and results. */
export const IdentifiedFields: readonly FieldMeta[] = [
  { name: "id", label: "Id", kind: "string", required: true },
];
