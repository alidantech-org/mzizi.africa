import type { FieldMeta } from "#/lib/dryv/transport.ts";

/** Base for operational records: identity and creation time. */
export interface Created {
  createdAt: string;
  id: string;
}

/** Field metadata for forms and results. */
export const CreatedFields: readonly FieldMeta[] = [
  { name: "createdAt", label: "Created At", kind: "date", required: true },
  { name: "id", label: "Id", kind: "string", required: true },
];
