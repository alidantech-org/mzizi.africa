import type { FieldMeta } from "#/_archives/lib/dryv/transport";

/** Governance Tree Nodes Performance */
export interface GovernanceTreeNodesPerformance {
  basis: string;
  of: number;
  rank: number;
  samples: number;
  score: number;
  text: string;
}

/** Field metadata for forms and results. */
export const GovernanceTreeNodesPerformanceFields: readonly FieldMeta[] = [
  { name: "basis", label: "Basis", kind: "string", required: true },
  { name: "of", label: "Of", kind: "number", required: true },
  { name: "rank", label: "Rank", kind: "number", required: true },
  { name: "samples", label: "Samples", kind: "number", required: true },
  { name: "score", label: "Score", kind: "number", required: true },
  { name: "text", label: "Text", kind: "string", required: true },
];
