import type { InsightsGovernanceTabsArms } from "#sdk/types/insights/dto/governance-tabs-arms.ts";
import type { InsightsGovernanceTabsTabs } from "#sdk/types/insights/dto/governance-tabs-tabs.ts";

/** Governance Tabs */
export interface InsightsGovernanceTabs {
  arms: InsightsGovernanceTabsArms[];
  gaps: string[];
  tabs: InsightsGovernanceTabsTabs[];
}
