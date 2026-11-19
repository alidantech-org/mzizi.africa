import type { FieldMeta } from "#/_archives/lib/dryv/transport";

/** Stable identity and stewardship snapshot for a controlled vocabulary scheme. */
export interface Scheme {
  code: string;
  createdAt: string;
  deletedAt?: string | null;
  id: string;
  ownerSnapshot: string;
  title: string;
  updatedAt: string;
  version: number;
}

/** Field metadata for forms and results. */
export const SchemeFields: readonly FieldMeta[] = [
  { name: "code", label: "Code", kind: "string", required: true },
  { name: "createdAt", label: "Created At", kind: "date", required: true },
  { name: "deletedAt", label: "Deleted At", kind: "date", required: false },
  { name: "id", label: "Id", kind: "string", required: true },
  {
    name: "ownerSnapshot",
    label: "Owner Snapshot",
    kind: "string",
    required: true,
  },
  { name: "title", label: "Title", kind: "string", required: true },
  { name: "updatedAt", label: "Updated At", kind: "date", required: true },
  { name: "version", label: "Version", kind: "number", required: true },
];
