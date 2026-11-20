import type { InsightsMotionDetailLegal } from "#sdk/types/insights/dto/motion-detail-legal.ts";
import type { InsightsMotionDetailMembers } from "#sdk/types/insights/dto/motion-detail-members.ts";
import type { InsightsMotionDetailMotion } from "#sdk/types/insights/dto/motion-detail-motion.ts";
import type { InsightsMotionDetailParties } from "#sdk/types/insights/dto/motion-detail-parties.ts";
import type { InsightsMotionDetailTally } from "#sdk/types/insights/dto/motion-detail-tally.ts";

/** Motion Detail */
export interface InsightsMotionDetail {
  gaps: string[];
  legal: InsightsMotionDetailLegal;
  members: InsightsMotionDetailMembers[];
  motion: InsightsMotionDetailMotion;
  parties: InsightsMotionDetailParties[];
  tally: InsightsMotionDetailTally;
}
