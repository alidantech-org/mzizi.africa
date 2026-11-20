import type { InsightsInstitutionListArmsGroupsInstitutions } from "#sdk/types/insights/dto/institution-list-arms-groups-institutions.ts";
import type { InsightsInstitutionListArmsGroupsKind } from "#sdk/types/insights/dto/institution-list-arms-groups-kind.ts";

/** Institution List Arms Groups */
export interface InsightsInstitutionListArmsGroups {
  institutions: InsightsInstitutionListArmsGroupsInstitutions[];
  kind: InsightsInstitutionListArmsGroupsKind;
}
