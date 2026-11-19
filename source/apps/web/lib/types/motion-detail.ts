import type { FieldMeta } from "#/lib/dryv/transport.ts";
import { type MotionDetailLegal } from "#/lib/types/motion-detail-legal.ts";
import { type MotionDetailMembers } from "#/lib/types/motion-detail-members.ts";
import { type MotionDetailMotion } from "#/lib/types/motion-detail-motion.ts";
import { type MotionDetailParties } from "#/lib/types/motion-detail-parties.ts";
import { type MotionDetailTally } from "#/lib/types/motion-detail-tally.ts";

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
