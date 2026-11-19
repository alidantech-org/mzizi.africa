import type { FieldMeta } from "#/lib/dryv/transport.ts";

/** Governance Tree Edges */
export interface GovernanceTreeEdges {
  from: string;
  kind: string;
  to: string;
}

/** Field metadata for forms and results. */
export const GovernanceTreeEdgesFields: readonly FieldMeta[] = [
  { name: "from", label: "From", kind: "string", required: true },
  { name: "kind", label: "Kind", kind: "string", required: true },
  { name: "to", label: "To", kind: "string", required: true },
];
