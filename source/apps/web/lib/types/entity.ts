import type { FieldMeta } from "#/lib/dryv/transport.ts";

/** Base for versioned records: id, version, created/updated timestamps and soft delete. */
export interface Entity {
  createdAt: string;
  deletedAt?: string | null;
  id: string;
  updatedAt: string;
  version: number;
}

/** Field metadata for forms and results. */
export const EntityFields: readonly FieldMeta[] = [
  { name: "createdAt", label: "Created At", kind: "date", required: true },
  { name: "deletedAt", label: "Deleted At", kind: "date", required: false },
  { name: "id", label: "Id", kind: "string", required: true },
  { name: "updatedAt", label: "Updated At", kind: "date", required: true },
  { name: "version", label: "Version", kind: "number", required: true },
];
