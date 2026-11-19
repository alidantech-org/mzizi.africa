import type { String } from "#/modules/shared/schema/type/string.type.ts";
import type { MotionDetailMotionContributions } from "#/modules/insights/schema/interface/motion-detail-motion-contributions.interface.ts";

/** Motion Detail Motion */
export interface MotionDetailMotion {
  code: String;
  contributions: MotionDetailMotionContributions[];
  heldOn: String;
  institution: String;
  institutionId: String;
  kind: String;
  movedBy: String;
  outcome: String;
  sitting: String;
  summary: String;
  title: String;
}
