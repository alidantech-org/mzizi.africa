import type { InsightsGovernanceTreeEdges } from "#sdk/types/insights/dto/governance-tree-edges.ts";
import type { InsightsGovernanceTreeLegend } from "#sdk/types/insights/dto/governance-tree-legend.ts";
import type { InsightsGovernanceTreeNodes } from "#sdk/types/insights/dto/governance-tree-nodes.ts";
import type { InsightsGovernanceTreeRail } from "#sdk/types/insights/dto/governance-tree-rail.ts";
import type { InsightsGovernanceTreeTab } from "#sdk/types/insights/dto/governance-tree-tab.ts";
import type { InsightsPlaceCrumb } from "#sdk/types/insights/dto/place-crumb.ts";

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
