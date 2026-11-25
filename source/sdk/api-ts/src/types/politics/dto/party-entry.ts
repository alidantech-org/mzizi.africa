import type { PoliticsPartyEntryNames } from "#sdk/types/politics/dto/party-entry-names.ts";

/** Party Entry */
export interface PoliticsPartyEntry {
  code: string;
  fromYear: number | null;
  kindTerm: string;
  names: PoliticsPartyEntryNames[];
  partyId: string;
  toYear: number | null;
}
