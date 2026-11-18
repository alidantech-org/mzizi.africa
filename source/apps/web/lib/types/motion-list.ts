import type { FieldMeta } from "#/lib/dryv/transport.ts";

/** Motion List */
export interface MotionList {
  motions: unknown[];
}

/** Field metadata for forms and results. */
export const MotionListFields: readonly FieldMeta[] = [
  { name: "motions", label: "Motions", kind: "other", required: true },
];
