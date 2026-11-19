import type { InsightsGovernanceTabsArmsInstitutionsKind } from "#sdk/types/insights/governance-tabs-arms-institutions-kind.ts";

/** Governance Tabs Arms Institutions */
export interface InsightsGovernanceTabsArmsInstitutions {
  code: string;
  image?: string | null;
  kind: InsightsGovernanceTabsArmsInstitutionsKind;
  leaders: number;
  name: string;
}
