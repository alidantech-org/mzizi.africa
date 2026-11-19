import type { FieldMeta } from "#/_archives/lib/dryv/transport";
import { type GovernanceTabsArms } from "#/_archives/lib/types/governance-tabs-arms";
import { type GovernanceTabsTabs } from "#/_archives/lib/types/governance-tabs-tabs";

/** Governance Tabs */
export interface GovernanceTabs {
  arms: GovernanceTabsArms[];
  gaps: string[];
  tabs: GovernanceTabsTabs[];
}

/** Field metadata for forms and results. */
export const GovernanceTabsFields: readonly FieldMeta[] = [
  { name: "arms", label: "Arms", kind: "other", required: true },
  { name: "gaps", label: "Gaps", kind: "string", required: true },
  { name: "tabs", label: "Tabs", kind: "other", required: true },
];
