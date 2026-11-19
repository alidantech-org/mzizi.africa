import type { NonEmptyString500 } from "#/modules/shared/schema/type/non-empty-string500.type.ts";
import type { PartyDetailFunding } from "#/modules/insights/schema/interface/party-detail-funding.interface.ts";
import type { PartyDetailMembers } from "#/modules/insights/schema/interface/party-detail-members.interface.ts";
import type { PartyDetailParty } from "#/modules/insights/schema/interface/party-detail-party.interface.ts";
import type { PartyDetailResults } from "#/modules/insights/schema/interface/party-detail-results.interface.ts";

/** Party Detail */
export interface PartyDetail {
  funding: PartyDetailFunding[];
  gaps: NonEmptyString500[];
  members: PartyDetailMembers[];
  party: PartyDetailParty;
  results: PartyDetailResults[];
}
