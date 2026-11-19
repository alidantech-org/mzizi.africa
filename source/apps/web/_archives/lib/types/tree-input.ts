import type { FieldMeta } from "#/_archives/lib/dryv/transport";

/** Tree Input */
export interface TreeInput {
  featureId?: string;
}

/** Field metadata for forms and results. */
export const TreeInputFields: readonly FieldMeta[] = [
  { name: "featureId", label: "Feature Id", kind: "string", required: false },
];
