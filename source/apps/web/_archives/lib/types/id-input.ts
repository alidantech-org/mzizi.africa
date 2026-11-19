import type { FieldMeta } from "#/_archives/lib/dryv/transport";

/** Id Input */
export interface IdInput {
  id: string;
}

/** Field metadata for forms and results. */
export const IdInputFields: readonly FieldMeta[] = [
  { name: "id", label: "Id", kind: "string", required: true },
];
