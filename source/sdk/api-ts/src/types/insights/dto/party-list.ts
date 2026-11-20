import type { InsightsPartyListParties } from "#sdk/types/insights/dto/party-list-parties.ts";

/** Party List */
export interface InsightsPartyList {
  gaps: string[];
  parties: InsightsPartyListParties[];
}
