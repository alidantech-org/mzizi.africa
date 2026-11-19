import type { Number } from "#/modules/shared/schema/type/number.type.ts";
import type { String } from "#/modules/shared/schema/type/string.type.ts";

/** Election Detail Contests */
export interface ElectionDetailContests {
  contests: Number;
  kind: String;
}
