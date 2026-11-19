import type { FieldMeta } from "#/lib/dryv/transport.ts";
import { type GovernanceTabsArms } from "#/lib/types/governance-tabs-arms.ts";
import { type GovernanceTabsTabs } from "#/lib/types/governance-tabs-tabs.ts";

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
