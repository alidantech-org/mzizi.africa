import type { FieldMeta } from "#/lib/dryv/transport.ts";

/** Tree Input */
export interface TreeInput {
  featureId?: string;
}

/** Field metadata for forms and results. */
export const TreeInputFields: readonly FieldMeta[] = [
  { name: "featureId", label: "Feature Id", kind: "string", required: false },
];
