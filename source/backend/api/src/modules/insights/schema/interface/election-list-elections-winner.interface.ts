import type { Number } from "#/modules/shared/schema/type/number.type.ts";
import type { String } from "#/modules/shared/schema/type/string.type.ts";

/** Election List Elections Winner */
export interface ElectionListElectionsWinner {
  name: String;
  party: String;
  votes: Number;
}
