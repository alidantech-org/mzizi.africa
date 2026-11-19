import type { FieldMeta } from "#/lib/dryv/transport.ts";

/** Governance Tree Legend */
export interface GovernanceTreeLegend {
  code: string;
  label: string;
}

/** Field metadata for forms and results. */
export const GovernanceTreeLegendFields: readonly FieldMeta[] = [
  { name: "code", label: "Code", kind: "string", required: true },
  { name: "label", label: "Label", kind: "string", required: true },
];
