import type { FieldMeta } from "#/_archives/lib/dryv/transport";

/** Base for operational records: identity, creation time and last-change time. */
export interface Timestamped {
  createdAt: string;
  id: string;
  updatedAt: string;
}

/** Field metadata for forms and results. */
export const TimestampedFields: readonly FieldMeta[] = [
  { name: "createdAt", label: "Created At", kind: "date", required: true },
  { name: "id", label: "Id", kind: "string", required: true },
  { name: "updatedAt", label: "Updated At", kind: "date", required: true },
];
