import type { TallyEntry } from "#/modules/election/schema/interface/tally-entry.interface.ts";

/** Tally Collection */
export interface TallyCollection {
  tallies: TallyEntry[];
}
