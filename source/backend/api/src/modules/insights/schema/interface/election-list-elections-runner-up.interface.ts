import type { Number } from "#/modules/shared/schema/type/number.type.ts";
import type { String } from "#/modules/shared/schema/type/string.type.ts";

/** Election List Elections Runner Up */
export interface ElectionListElectionsRunnerUp {
  name: String;
  party: String;
  votes: Number;
}
