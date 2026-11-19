import type { Number } from "#/modules/shared/schema/type/number.type.ts";
import type { String } from "#/modules/shared/schema/type/string.type.ts";

/** Governance Tree Nodes Performance */
export interface GovernanceTreeNodesPerformance {
  basis: String;
  of: Number;
  rank: Number;
  samples: Number;
  score: Number;
  text: String;
}
