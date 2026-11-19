import type { FieldMeta } from "#/_archives/lib/dryv/transport";

/** Governance Tree Rail Refs */
export interface GovernanceTreeRailRefs {
  code: string;
  kind: string;
  table: string;
}

/** Field metadata for forms and results. */
export const GovernanceTreeRailRefsFields: readonly FieldMeta[] = [
  { name: "code", label: "Code", kind: "string", required: true },
  { name: "kind", label: "Kind", kind: "string", required: true },
  { name: "table", label: "Table", kind: "string", required: true },
];
