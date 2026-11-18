import type { FieldMeta } from "#/lib/dryv/transport.ts";

/** Fact List */
export interface FactList {
  facts: unknown[];
  gaps: string[];
}

/** Field metadata for forms and results. */
export const FactListFields: readonly FieldMeta[] = [
  { name: "facts", label: "Facts", kind: "other", required: true },
  { name: "gaps", label: "Gaps", kind: "string", required: true },
];
