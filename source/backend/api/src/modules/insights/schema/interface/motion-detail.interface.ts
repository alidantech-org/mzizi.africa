import type { NonEmptyString500 } from "#/modules/shared/schema/type/non-empty-string500.type.ts";
import type { MotionDetailLegal } from "#/modules/insights/schema/interface/motion-detail-legal.interface.ts";
import type { MotionDetailMembers } from "#/modules/insights/schema/interface/motion-detail-members.interface.ts";
import type { MotionDetailMotion } from "#/modules/insights/schema/interface/motion-detail-motion.interface.ts";
import type { MotionDetailParties } from "#/modules/insights/schema/interface/motion-detail-parties.interface.ts";
import type { MotionDetailTally } from "#/modules/insights/schema/interface/motion-detail-tally.interface.ts";

/** Motion Detail */
export interface MotionDetail {
  gaps: NonEmptyString500[];
  legal: MotionDetailLegal;
  members: MotionDetailMembers[];
  motion: MotionDetailMotion;
  parties: MotionDetailParties[];
  tally: MotionDetailTally;
}
