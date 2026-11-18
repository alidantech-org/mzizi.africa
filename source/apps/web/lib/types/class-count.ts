import type { FieldMeta } from "#/lib/dryv/transport.ts";

/** Class Count */
export interface ClassCount {
  code: string;
  count: number;
  label: string;
  parentCode?: string | null;
}

/** Field metadata for forms and results. */
export const ClassCountFields: readonly FieldMeta[] = [
  { name: "code", label: "Code", kind: "string", required: true },
  { name: "count", label: "Count", kind: "number", required: true },
  { name: "label", label: "Label", kind: "string", required: true },
  { name: "parentCode", label: "Parent Code", kind: "string", required: false },
];
