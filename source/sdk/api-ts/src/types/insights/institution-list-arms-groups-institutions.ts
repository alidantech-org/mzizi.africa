import type { InsightsInstitutionListArmsGroupsInstitutionsArm } from "#sdk/types/insights/institution-list-arms-groups-institutions-arm.ts";
import type { InsightsInstitutionListArmsGroupsInstitutionsBasis } from "#sdk/types/insights/institution-list-arms-groups-institutions-basis.ts";
import type { InsightsInstitutionListArmsGroupsInstitutionsKind } from "#sdk/types/insights/institution-list-arms-groups-institutions-kind.ts";
import type { InsightsInstitutionListArmsGroupsInstitutionsParent } from "#sdk/types/insights/institution-list-arms-groups-institutions-parent.ts";

/** Institution List Arms Groups Institutions */
export interface InsightsInstitutionListArmsGroupsInstitutions {
  arm: InsightsInstitutionListArmsGroupsInstitutionsArm;
  basis: InsightsInstitutionListArmsGroupsInstitutionsBasis;
  children: number;
  code: string;
  image?: string | null;
  kind: InsightsInstitutionListArmsGroupsInstitutionsKind;
  leaders: number;
  name: string;
  parent?: InsightsInstitutionListArmsGroupsInstitutionsParent | null;
  purpose: string;
}
