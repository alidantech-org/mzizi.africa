import type { FieldMeta } from "#/lib/dryv/transport.ts";

/** Column Info */
export interface ColumnInfo {
  name: string;
  nullable: boolean;
  primary: boolean;
  type: string;
}

/** Field metadata for forms and results. */
export const ColumnInfoFields: readonly FieldMeta[] = [
  { name: "name", label: "Name", kind: "string", required: true },
  { name: "nullable", label: "Nullable", kind: "boolean", required: true },
  { name: "primary", label: "Primary", kind: "boolean", required: true },
  { name: "type", label: "Type", kind: "string", required: true },
];
