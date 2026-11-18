import type { FieldMeta } from "#/lib/dryv/transport.ts";
import { type PlaceCrumb } from "#/lib/types/place-crumb.ts";

/** Governance Tree */
export interface GovernanceTree {
  edges: unknown[];
  gaps: string[];
  legend: unknown[];
  nodes: unknown[];
  place?: PlaceCrumb | null;
  rail: unknown[];
  tab: unknown;
}

/** Field metadata for forms and results. */
export const GovernanceTreeFields: readonly FieldMeta[] = [
  { name: "edges", label: "Edges", kind: "other", required: true },
  { name: "gaps", label: "Gaps", kind: "string", required: true },
  { name: "legend", label: "Legend", kind: "other", required: true },
  { name: "nodes", label: "Nodes", kind: "other", required: true },
  { name: "place", label: "Place", kind: "other", required: false },
  { name: "rail", label: "Rail", kind: "other", required: true },
  { name: "tab", label: "Tab", kind: "other", required: true },
];
