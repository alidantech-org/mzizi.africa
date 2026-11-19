import type { Number } from "#/modules/shared/schema/type/number.type.ts";
import type { String } from "#/modules/shared/schema/type/string.type.ts";

/** Motion Detail Parties */
export interface MotionDetailParties {
  absent: Number;
  abstain: Number;
  no: Number;
  party: String;
  yes: Number;
}
