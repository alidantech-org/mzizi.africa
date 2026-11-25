import type { PoliticsPartyDetailCoalitions } from "#sdk/types/politics/dto/party-detail-coalitions.ts";
import type { PoliticsPartyDetailNames } from "#sdk/types/politics/dto/party-detail-names.ts";

/** Party Detail */
export interface PoliticsPartyDetail {
  coalitions: PoliticsPartyDetailCoalitions[];
  code: string;
  countryId: string;
  fromYear: number | null;
  kindTerm: string;
  names: PoliticsPartyDetailNames[];
  partyId: string;
  toYear: number | null;
}
