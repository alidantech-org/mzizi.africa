import type { FieldMeta } from "#/_archives/lib/dryv/transport";
import { type GovernanceTreeEdges } from "#/_archives/lib/types/governance-tree-edges";
import { type GovernanceTreeLegend } from "#/_archives/lib/types/governance-tree-legend";
import { type GovernanceTreeNodes } from "#/_archives/lib/types/governance-tree-nodes";
import { type GovernanceTreeRail } from "#/_archives/lib/types/governance-tree-rail";
import { type GovernanceTreeTab } from "#/_archives/lib/types/governance-tree-tab";
import { type PlaceCrumb } from "#/_archives/lib/types/place-crumb";

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
