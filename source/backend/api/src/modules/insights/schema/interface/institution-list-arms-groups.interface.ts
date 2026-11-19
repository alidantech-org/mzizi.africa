import type { InstitutionListArmsGroupsInstitutions } from "#/modules/insights/schema/interface/institution-list-arms-groups-institutions.interface.ts";
import type { InstitutionListArmsGroupsKind } from "#/modules/insights/schema/interface/institution-list-arms-groups-kind.interface.ts";

/** Institution List Arms Groups */
export interface InstitutionListArmsGroups {
  institutions: InstitutionListArmsGroupsInstitutions[];
  kind: InstitutionListArmsGroupsKind;
}
