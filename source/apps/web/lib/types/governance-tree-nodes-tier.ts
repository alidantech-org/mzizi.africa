import type { FieldMeta } from "#/lib/dryv/transport.ts";

/** Governance Tree Nodes Tier */
export interface GovernanceTreeNodesTier {
  code: string;
  label: string;
  position?: number | null;
}

/** Field metadata for forms and results. */
export const GovernanceTreeNodesTierFields: readonly FieldMeta[] = [
  { name: "code", label: "Code", kind: "string", required: true },
  { name: "label", label: "Label", kind: "string", required: true },
  { name: "position", label: "Position", kind: "number", required: false },
];
