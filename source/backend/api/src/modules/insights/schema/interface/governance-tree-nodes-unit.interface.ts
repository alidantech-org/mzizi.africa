import type { String } from "#/modules/shared/schema/type/string.type.ts";

/** Governance Tree Nodes Unit */
export interface GovernanceTreeNodesUnit {
  featureId: String;
  name: String;
  path?: String;
}
