import type { Number } from "#/modules/shared/schema/type/number.type.ts";
import type { String } from "#/modules/shared/schema/type/string.type.ts";

/** Leader Profile Election */
export interface LeaderProfileElection {
  candidates: Number;
  heldOn: String;
  margin: Number;
  registered: Number;
  runnerUp: Number;
  share: Number;
  total: Number;
  votes: Number;
  year: Number;
}
