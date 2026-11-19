import type { FieldMeta } from "#/lib/dryv/transport.ts";

/** Governance Tree Nodes Unit */
export interface GovernanceTreeNodesUnit {
  featureId: string;
  name: string;
  path?: string;
}

/** Field metadata for forms and results. */
export const GovernanceTreeNodesUnitFields: readonly FieldMeta[] = [
  { name: "featureId", label: "Feature Id", kind: "string", required: true },
  { name: "name", label: "Name", kind: "string", required: true },
  { name: "path", label: "Path", kind: "string", required: false },
];
