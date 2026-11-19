import type { Number } from "#/modules/shared/schema/type/number.type.ts";
import type { String } from "#/modules/shared/schema/type/string.type.ts";

/** Motion List Motions */
export interface MotionListMotions {
  absent: Number;
  abstain: Number;
  code: String;
  heldOn: String;
  institution: String;
  institutionId: String;
  kind: String;
  no: Number;
  outcome: String;
  summary: String;
  title: String;
  yes: Number;
}
