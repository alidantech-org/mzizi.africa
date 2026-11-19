import type { FieldMeta } from "#/lib/dryv/transport.ts";
import { type GovernanceTreeEdges } from "#/lib/types/governance-tree-edges.ts";
import { type GovernanceTreeLegend } from "#/lib/types/governance-tree-legend.ts";
import { type GovernanceTreeNodes } from "#/lib/types/governance-tree-nodes.ts";
import { type GovernanceTreeRail } from "#/lib/types/governance-tree-rail.ts";
import { type GovernanceTreeTab } from "#/lib/types/governance-tree-tab.ts";
import { type PlaceCrumb } from "#/lib/types/place-crumb.ts";

/** Governance Tree */
export interface GovernanceTree {
  edges: GovernanceTreeEdges[];
  gaps: string[];
  legend: GovernanceTreeLegend[];
  nodes: GovernanceTreeNodes[];
  place?: PlaceCrumb | null;
  rail: GovernanceTreeRail[];
  tab?: GovernanceTreeTab | null;
}

/** Field metadata for forms and results. */
export const GovernanceTreeFields: readonly FieldMeta[] = [
  { name: "edges", label: "Edges", kind: "other", required: true },
  { name: "gaps", label: "Gaps", kind: "string", required: true },
  { name: "legend", label: "Legend", kind: "other", required: true },
  { name: "nodes", label: "Nodes", kind: "other", required: true },
  { name: "place", label: "Place", kind: "other", required: false },
  { name: "rail", label: "Rail", kind: "other", required: true },
  { name: "tab", label: "Tab", kind: "other", required: false },
];
