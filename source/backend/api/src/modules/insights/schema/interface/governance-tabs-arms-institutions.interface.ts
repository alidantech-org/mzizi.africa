import type { Number } from "#/modules/shared/schema/type/number.type.ts";
import type { String } from "#/modules/shared/schema/type/string.type.ts";
import type { GovernanceTabsArmsInstitutionsKind } from "#/modules/insights/schema/interface/governance-tabs-arms-institutions-kind.interface.ts";

/** Governance Tabs Arms Institutions */
export interface GovernanceTabsArmsInstitutions {
  code: String;
  image?: String | null;
  kind: GovernanceTabsArmsInstitutionsKind;
  leaders: Number;
  name: String;
}
