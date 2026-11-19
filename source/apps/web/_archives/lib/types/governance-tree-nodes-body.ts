import type { FieldMeta } from "#/_archives/lib/dryv/transport";

/** Governance Tree Nodes Body */
export interface GovernanceTreeNodesBody {
  code: string;
  name: string;
}

/** Field metadata for forms and results. */
export const GovernanceTreeNodesBodyFields: readonly FieldMeta[] = [
  { name: "code", label: "Code", kind: "string", required: true },
  { name: "name", label: "Name", kind: "string", required: true },
];
