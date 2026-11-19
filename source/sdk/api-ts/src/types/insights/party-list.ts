import type { InsightsPartyListParties } from "#sdk/types/insights/party-list-parties.ts";

/** Party List */
export interface InsightsPartyList {
  gaps: string[];
  parties: InsightsPartyListParties[];
}
