import type { FieldMeta } from "#/lib/dryv/transport.ts";
import { type MotionListMotions } from "#/lib/types/motion-list-motions.ts";

/** Motion List */
export interface MotionList {
  motions: MotionListMotions[];
}

/** Field metadata for forms and results. */
export const MotionListFields: readonly FieldMeta[] = [
  { name: "motions", label: "Motions", kind: "other", required: true },
];
