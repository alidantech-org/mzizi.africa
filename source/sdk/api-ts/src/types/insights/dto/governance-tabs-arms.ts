import type { InsightsGovernanceTabsArmsInstitutions } from "#sdk/types/insights/dto/governance-tabs-arms-institutions.ts";

/** Governance Tabs Arms */
export interface InsightsGovernanceTabsArms {
  about: string;
  code: string;
  institutions: InsightsGovernanceTabsArmsInstitutions[];
  label: string;
}
