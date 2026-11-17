import type { FieldMeta } from "#/lib/dryv/transport.ts";

/** Seed Column */
export interface SeedColumn {
  kind: string;
  name: string;
  required: boolean;
  targetColumn?: string | null;
  targetTable?: string | null;
}

/** Field metadata for forms and results. */
export const SeedColumnFields: readonly FieldMeta[] = [
  { name: "kind", label: "Kind", kind: "string", required: true },
  { name: "name", label: "Name", kind: "string", required: true },
  { name: "required", label: "Required", kind: "boolean", required: true },
  { name: "targetColumn", label: "Target Column", kind: "string", required: false },
  { name: "targetTable", label: "Target Table", kind: "string", required: false },
];
