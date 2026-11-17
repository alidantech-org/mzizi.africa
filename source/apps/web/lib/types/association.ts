import type { FieldMeta } from "#/lib/dryv/transport.ts";

/** Base for association rows: id, created timestamp and soft delete. */
export interface Association {
  createdAt: string;
  deletedAt?: string | null;
  id: string;
}

/** Field metadata for forms and results. */
export const AssociationFields: readonly FieldMeta[] = [
  { name: "createdAt", label: "Created At", kind: "date", required: true },
  { name: "deletedAt", label: "Deleted At", kind: "date", required: false },
  { name: "id", label: "Id", kind: "string", required: true },
];
