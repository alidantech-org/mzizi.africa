import type { InsightsGovernanceTreeEdges } from "#sdk/types/insights/governance-tree-edges.ts";
import type { InsightsGovernanceTreeLegend } from "#sdk/types/insights/governance-tree-legend.ts";
import type { InsightsGovernanceTreeNodes } from "#sdk/types/insights/governance-tree-nodes.ts";
import type { InsightsGovernanceTreeRail } from "#sdk/types/insights/governance-tree-rail.ts";
import type { InsightsGovernanceTreeTab } from "#sdk/types/insights/governance-tree-tab.ts";
import type { InsightsPlaceCrumb } from "#sdk/types/insights/place-crumb.ts";

/** Governance Tree */
export interface InsightsGovernanceTree {
  edges: InsightsGovernanceTreeEdges[];
  gaps: string[];
  legend: InsightsGovernanceTreeLegend[];
  nodes: InsightsGovernanceTreeNodes[];
  place?: InsightsPlaceCrumb | null;
  rail: InsightsGovernanceTreeRail[];
  tab?: InsightsGovernanceTreeTab | null;
}
