import type { FieldMeta } from "#/lib/dryv/transport.ts";

/** Election List */
export interface ElectionList {
  elections: unknown[];
}

/** Field metadata for forms and results. */
export const ElectionListFields: readonly FieldMeta[] = [
  { name: "elections", label: "Elections", kind: "other", required: true },
];
