import type { NonEmptyString500 } from "#/modules/shared/schema/type/non-empty-string500.type.ts";
import type { GovernanceTabsArms } from "#/modules/insights/schema/interface/governance-tabs-arms.interface.ts";
import type { GovernanceTabsTabs } from "#/modules/insights/schema/interface/governance-tabs-tabs.interface.ts";

/** Governance Tabs */
export interface GovernanceTabs {
  arms: GovernanceTabsArms[];
  gaps: NonEmptyString500[];
  tabs: GovernanceTabsTabs[];
}
