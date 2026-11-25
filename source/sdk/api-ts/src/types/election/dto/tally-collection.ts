import type { ElectionTallyEntry } from "#sdk/types/election/dto/tally-entry.ts";

/** Tally Collection */
export interface ElectionTallyCollection {
  tallies: ElectionTallyEntry[];
}
