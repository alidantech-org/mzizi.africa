import type { FieldMeta } from "#/lib/dryv/transport.ts";

/** Column Plan */
export interface ColumnPlan {
  clean?: unknown[];
  keep?: boolean;
  name?: string;
  source: string;
}

/** Field metadata for forms and results. */
export const ColumnPlanFields: readonly FieldMeta[] = [
  { name: "clean", label: "Clean", kind: "other", required: false },
  { name: "keep", label: "Keep", kind: "boolean", required: false },
  { name: "name", label: "Name", kind: "string", required: false },
  { name: "source", label: "Source", kind: "string", required: true },
];
