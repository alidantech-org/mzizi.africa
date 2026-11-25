import type { LegislatureVoteEntry } from "#sdk/types/legislature/dto/vote-entry.ts";

/** Vote Collection */
export interface LegislatureVoteCollection {
  votes: LegislatureVoteEntry[];
}
