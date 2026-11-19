import type { Number } from "#/modules/shared/schema/type/number.type.ts";
import type { String } from "#/modules/shared/schema/type/string.type.ts";

/** Party List Parties */
export interface PartyListParties {
  code: String;
  fundAllocationKes?: Number | null;
  members: Number;
  name: String;
  officeHolders: Number;
  votes2022: Number;
}
