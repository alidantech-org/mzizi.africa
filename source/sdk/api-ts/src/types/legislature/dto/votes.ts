import { LegislatureVoteChoice } from "#sdk/types/legislature/enums/vote-choice.ts";

/** How one member voted on one motion. */
export interface LegislatureVotes {
  choice: LegislatureVoteChoice;
  countryId: string;
  createdAt: string;
  deletedAt?: string | null;
  holderId: string;
  id: string;
  motionId: string;
  partyId?: string | null;
  updatedAt: string;
  version: number;
}
