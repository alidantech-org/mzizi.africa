import type { ElectionListElections } from "#/modules/insights/schema/interface/election-list-elections.interface.ts";

/** Election List */
export interface ElectionList {
  elections: ElectionListElections[];
}
