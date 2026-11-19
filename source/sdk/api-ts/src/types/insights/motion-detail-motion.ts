import type { InsightsMotionDetailMotionContributions } from "#sdk/types/insights/motion-detail-motion-contributions.ts";

/** Motion Detail Motion */
export interface InsightsMotionDetailMotion {
  code: string;
  contributions: InsightsMotionDetailMotionContributions[];
  heldOn: string;
  institution: string;
  institutionId: string;
  kind: string;
  movedBy: string;
  outcome: string;
  sitting: string;
  summary: string;
  title: string;
}
