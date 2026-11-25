import type { ElectionEntry } from "#/modules/election/schema/interface/election-entry.interface.ts";

/** Election Collection */
export interface ElectionCollection {
  elections: ElectionEntry[];
}
