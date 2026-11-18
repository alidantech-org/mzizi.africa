import type { FieldMeta } from "#/lib/dryv/transport.ts";

/** Governance Tabs */
export interface GovernanceTabs {
  arms: unknown[];
  gaps: string[];
  tabs: unknown[];
}

/** Field metadata for forms and results. */
export const GovernanceTabsFields: readonly FieldMeta[] = [
  { name: "arms", label: "Arms", kind: "other", required: true },
  { name: "gaps", label: "Gaps", kind: "string", required: true },
  { name: "tabs", label: "Tabs", kind: "other", required: true },
];
