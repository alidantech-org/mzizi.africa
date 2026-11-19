import type { Number } from "#/modules/shared/schema/type/number.type.ts";
import type { String } from "#/modules/shared/schema/type/string.type.ts";

/** Party Detail Results */
export interface PartyDetailResults {
  candidates: Number;
  contest: String;
  votes: Number;
  won: Number;
  year: Number;
}
