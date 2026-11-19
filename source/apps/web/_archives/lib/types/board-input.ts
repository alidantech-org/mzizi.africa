import type { FieldMeta } from "#/_archives/lib/dryv/transport";

/** Board Input */
export interface BoardInput {
  kindCode?: string;
  limit?: number;
  metricCode: string;
  parentFeatureId?: string;
}

/** Field metadata for forms and results. */
export const BoardInputFields: readonly FieldMeta[] = [
  { name: "kindCode", label: "Kind Code", kind: "string", required: false },
  { name: "limit", label: "Limit", kind: "number", required: false },
  { name: "metricCode", label: "Metric Code", kind: "string", required: true },
  {
    name: "parentFeatureId",
    label: "Parent Feature Id",
    kind: "string",
    required: false,
  },
];
