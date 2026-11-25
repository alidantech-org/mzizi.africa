import { LegislatureVoteChoice } from "#sdk/types/legislature/enums/vote-choice.ts";

/** Vote Entry */
export interface LegislatureVoteEntry {
  choice: LegislatureVoteChoice;
  holderId: string;
  individualId: string;
  partyCode: string | null;
  partyId: string | null;
}
