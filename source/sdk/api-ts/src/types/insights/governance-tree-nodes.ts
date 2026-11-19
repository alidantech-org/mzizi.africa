import type { InsightsGovernanceTreeNodesBody } from "#sdk/types/insights/governance-tree-nodes-body.ts";
import type { InsightsGovernanceTreeNodesHow } from "#sdk/types/insights/governance-tree-nodes-how.ts";
import type { InsightsGovernanceTreeNodesPerformance } from "#sdk/types/insights/governance-tree-nodes-performance.ts";
import type { InsightsGovernanceTreeNodesRefs } from "#sdk/types/insights/governance-tree-nodes-refs.ts";
import type { InsightsGovernanceTreeNodesTier } from "#sdk/types/insights/governance-tree-nodes-tier.ts";
import type { InsightsGovernanceTreeNodesUnit } from "#sdk/types/insights/governance-tree-nodes-unit.ts";

/** Governance Tree Nodes */
export interface InsightsGovernanceTreeNodes {
  arm?: string;
  basis?: string;
  body?: InsightsGovernanceTreeNodesBody;
  code?: string;
  holderId?: string;
  how?: InsightsGovernanceTreeNodesHow;
  id: string;
  kind?: string;
  leaderSlug?: string;
  leaders?: number;
  level: string;
  name: string;
  party?: string | null;
  performance?: InsightsGovernanceTreeNodesPerformance | null;
  photo?: string;
  purpose?: string | null;
  refs: InsightsGovernanceTreeNodesRefs;
  since?: string;
  tier?: InsightsGovernanceTreeNodesTier;
  type: string;
  unit?: InsightsGovernanceTreeNodesUnit;
}
