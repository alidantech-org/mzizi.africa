import type { FieldMeta } from "#/_archives/lib/dryv/transport";
import { type MotionDetailLegal } from "#/_archives/lib/types/motion-detail-legal";
import { type MotionDetailMembers } from "#/_archives/lib/types/motion-detail-members";
import { type MotionDetailMotion } from "#/_archives/lib/types/motion-detail-motion";
import { type MotionDetailParties } from "#/_archives/lib/types/motion-detail-parties";
import { type MotionDetailTally } from "#/_archives/lib/types/motion-detail-tally";

/** Motion Detail */
export interface MotionDetail {
  gaps: string[];
  legal: MotionDetailLegal;
  members: MotionDetailMembers[];
  motion: MotionDetailMotion;
  parties: MotionDetailParties[];
  tally: MotionDetailTally;
}

/** Field metadata for forms and results. */
export const MotionDetailFields: readonly FieldMeta[] = [
  { name: "gaps", label: "Gaps", kind: "string", required: true },
  { name: "legal", label: "Legal", kind: "other", required: true },
  { name: "members", label: "Members", kind: "other", required: true },
  { name: "motion", label: "Motion", kind: "other", required: true },
  { name: "parties", label: "Parties", kind: "other", required: true },
  { name: "tally", label: "Tally", kind: "other", required: true },
];
