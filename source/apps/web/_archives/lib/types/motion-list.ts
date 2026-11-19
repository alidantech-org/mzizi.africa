import type { FieldMeta } from "#/_archives/lib/dryv/transport";
import { type MotionListMotions } from "#/_archives/lib/types/motion-list-motions";

/** Motion List */
export interface MotionList {
  motions: MotionListMotions[];
}

/** Field metadata for forms and results. */
export const MotionListFields: readonly FieldMeta[] = [
  { name: "motions", label: "Motions", kind: "other", required: true },
];
