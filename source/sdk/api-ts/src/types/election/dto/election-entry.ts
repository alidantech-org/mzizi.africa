import type { ElectionElectionEntryNames } from "#sdk/types/election/dto/election-entry-names.ts";

/** Election Entry */
export interface ElectionElectionEntry {
  code: string;
  electionId: string;
  eventId: string | null;
  fromYear: number;
  heldOn: string | null;
  kindTerm: string;
  names: ElectionElectionEntryNames[];
  statusTerm: string;
}
