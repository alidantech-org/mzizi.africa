import type { Number } from "#/modules/shared/schema/type/number.type.ts";
import type { String } from "#/modules/shared/schema/type/string.type.ts";
import type { GovernanceTreeNodesBody } from "#/modules/insights/schema/interface/governance-tree-nodes-body.interface.ts";
import type { GovernanceTreeNodesHow } from "#/modules/insights/schema/interface/governance-tree-nodes-how.interface.ts";
import type { GovernanceTreeNodesPerformance } from "#/modules/insights/schema/interface/governance-tree-nodes-performance.interface.ts";
import type { GovernanceTreeNodesRefs } from "#/modules/insights/schema/interface/governance-tree-nodes-refs.interface.ts";
import type { GovernanceTreeNodesTier } from "#/modules/insights/schema/interface/governance-tree-nodes-tier.interface.ts";
import type { GovernanceTreeNodesUnit } from "#/modules/insights/schema/interface/governance-tree-nodes-unit.interface.ts";

/** Governance Tree Nodes */
export interface GovernanceTreeNodes {
  arm?: String;
  basis?: String;
  body?: GovernanceTreeNodesBody;
  code?: String;
  holderId?: String;
  how?: GovernanceTreeNodesHow;
  id: String;
  kind?: String;
  leaderSlug?: String;
  leaders?: Number;
  level: String;
  name: String;
  party?: String | null;
  performance?: GovernanceTreeNodesPerformance | null;
  photo?: String;
  purpose?: String | null;
  refs: GovernanceTreeNodesRefs;
  since?: String;
  tier?: GovernanceTreeNodesTier;
  type: String;
  unit?: GovernanceTreeNodesUnit;
}
