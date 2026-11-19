import type { Number } from "#/modules/shared/schema/type/number.type.ts";
import type { String } from "#/modules/shared/schema/type/string.type.ts";

/** Election Detail Election */
export interface ElectionDetailElection {
  code: String;
  contestKind?: String;
  electionId: String;
  heldOn: String;
  year: Number;
}
