import type { NonEmptyString500 } from "#/modules/shared/schema/type/non-empty-string500.type.ts";
import type { GovernanceTreeEdges } from "#/modules/insights/schema/interface/governance-tree-edges.interface.ts";
import type { GovernanceTreeLegend } from "#/modules/insights/schema/interface/governance-tree-legend.interface.ts";
import type { GovernanceTreeNodes } from "#/modules/insights/schema/interface/governance-tree-nodes.interface.ts";
import type { GovernanceTreeRail } from "#/modules/insights/schema/interface/governance-tree-rail.interface.ts";
import type { GovernanceTreeTab } from "#/modules/insights/schema/interface/governance-tree-tab.interface.ts";
import type { PlaceCrumb } from "#/modules/insights/schema/interface/place-crumb.interface.ts";

/** Governance Tree */
export interface GovernanceTree {
  edges: GovernanceTreeEdges[];
  gaps: NonEmptyString500[];
  legend: GovernanceTreeLegend[];
  nodes: GovernanceTreeNodes[];
  place?: PlaceCrumb | null;
  rail: GovernanceTreeRail[];
  tab?: GovernanceTreeTab | null;
}
