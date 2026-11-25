import type { VoteEntry } from "#/modules/legislature/schema/interface/vote-entry.interface.ts";

/** Vote Collection */
export interface VoteCollection {
  votes: VoteEntry[];
}
