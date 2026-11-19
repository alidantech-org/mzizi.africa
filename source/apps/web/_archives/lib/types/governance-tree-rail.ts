import type { FieldMeta } from "#/_archives/lib/dryv/transport";
import { type GovernanceTreeRailRefs } from "#/_archives/lib/types/governance-tree-rail-refs";
import { type GovernanceTreeRailUnit } from "#/_archives/lib/types/governance-tree-rail-unit";

/** Governance Tree Rail */
export interface GovernanceTreeRail {
  about: string;
  code: string;
  count: number;
  label: string;
  refs: GovernanceTreeRailRefs;
  unit?: GovernanceTreeRailUnit | null;
}

/** Field metadata for forms and results. */
export const GovernanceTreeRailFields: readonly FieldMeta[] = [
  { name: "about", label: "About", kind: "string", required: true },
  { name: "code", label: "Code", kind: "string", required: true },
  { name: "count", label: "Count", kind: "number", required: true },
  { name: "label", label: "Label", kind: "string", required: true },
  { name: "refs", label: "Refs", kind: "other", required: true },
  { name: "unit", label: "Unit", kind: "other", required: false },
];
