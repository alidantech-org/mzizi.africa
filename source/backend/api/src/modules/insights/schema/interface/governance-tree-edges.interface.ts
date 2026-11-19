import type { String } from "#/modules/shared/schema/type/string.type.ts";

/** Governance Tree Edges */
export interface GovernanceTreeEdges {
  from: String;
  kind: String;
  to: String;
}
