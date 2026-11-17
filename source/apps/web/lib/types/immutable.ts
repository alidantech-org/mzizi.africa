import type { FieldMeta } from "#/lib/dryv/transport.ts";

/** Base for append-only operational records: identity written once. */
export interface Immutable {
  id: string;
}

/** Field metadata for forms and results. */
export const ImmutableFields: readonly FieldMeta[] = [
  { name: "id", label: "Id", kind: "string", required: true },
];
