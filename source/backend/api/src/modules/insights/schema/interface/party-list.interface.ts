import type { NonEmptyString500 } from "#/modules/shared/schema/type/non-empty-string500.type.ts";
import type { PartyListParties } from "#/modules/insights/schema/interface/party-list-parties.interface.ts";

/** Party List */
export interface PartyList {
  gaps: NonEmptyString500[];
  parties: PartyListParties[];
}
