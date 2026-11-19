import type { InsightsPartyDetailFunding } from "#sdk/types/insights/party-detail-funding.ts";
import type { InsightsPartyDetailMembers } from "#sdk/types/insights/party-detail-members.ts";
import type { InsightsPartyDetailParty } from "#sdk/types/insights/party-detail-party.ts";
import type { InsightsPartyDetailResults } from "#sdk/types/insights/party-detail-results.ts";

/** Party Detail */
export interface InsightsPartyDetail {
  funding: InsightsPartyDetailFunding[];
  gaps: string[];
  members: InsightsPartyDetailMembers[];
  party: InsightsPartyDetailParty;
  results: InsightsPartyDetailResults[];
}
