import type { String } from "#/modules/shared/schema/type/string.type.ts";
import type { GovernanceTabsArmsInstitutions } from "#/modules/insights/schema/interface/governance-tabs-arms-institutions.interface.ts";

/** Governance Tabs Arms */
export interface GovernanceTabsArms {
  about: String;
  code: String;
  institutions: GovernanceTabsArmsInstitutions[];
  label: String;
}
