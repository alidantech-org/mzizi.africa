import type { FieldMeta } from "#/lib/dryv/transport.ts";

/** Governance Tree Nodes Refs */
export interface GovernanceTreeNodesRefs {
  appointment?: string;
  basis?: string;
  code?: string;
  institution?: string;
  office?: string;
  scheme: string;
  table?: string;
  tier?: string;
  value?: string;
}

/** Field metadata for forms and results. */
export const GovernanceTreeNodesRefsFields: readonly FieldMeta[] = [
  { name: "appointment", label: "Appointment", kind: "string", required: false },
  { name: "basis", label: "Basis", kind: "string", required: false },
  { name: "code", label: "Code", kind: "string", required: false },
  { name: "institution", label: "Institution", kind: "string", required: false },
  { name: "office", label: "Office", kind: "string", required: false },
  { name: "scheme", label: "Scheme", kind: "string", required: true },
  { name: "table", label: "Table", kind: "string", required: false },
  { name: "tier", label: "Tier", kind: "string", required: false },
  { name: "value", label: "Value", kind: "string", required: false },
];
