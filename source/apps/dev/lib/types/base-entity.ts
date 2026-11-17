import type { FieldMeta } from "../dryv/transport.ts";

/** Base Entity */
export interface BaseEntity {
  createdAt: string;
  id: string;
  updatedAt: string;
  version: number;
}

/** Field metadata for forms and results. */
export const BaseEntityFields: readonly FieldMeta[] = [
  { name: "createdAt", label: "Created At", kind: "date", required: true },
  { name: "id", label: "Id", kind: "string", required: true },
  { name: "updatedAt", label: "Updated At", kind: "date", required: true },
  { name: "version", label: "Version", kind: "number", required: true },
];
