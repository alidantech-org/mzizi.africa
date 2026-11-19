import type { Flag } from "#/modules/shared/schema/type/flag.type.ts";
import type { Number } from "#/modules/shared/schema/type/number.type.ts";

/** Motion Detail Tally */
export interface MotionDetailTally {
  absent: Number;
  abstain: Number;
  no: Number;
  passed: Flag;
  total: Number;
  yes: Number;
}
