import type { Number } from "#/modules/shared/schema/type/number.type.ts";
import type { String } from "#/modules/shared/schema/type/string.type.ts";
import type { InstitutionListArmsGroupsInstitutionsArm } from "#/modules/insights/schema/interface/institution-list-arms-groups-institutions-arm.interface.ts";
import type { InstitutionListArmsGroupsInstitutionsBasis } from "#/modules/insights/schema/interface/institution-list-arms-groups-institutions-basis.interface.ts";
import type { InstitutionListArmsGroupsInstitutionsKind } from "#/modules/insights/schema/interface/institution-list-arms-groups-institutions-kind.interface.ts";
import type { InstitutionListArmsGroupsInstitutionsParent } from "#/modules/insights/schema/interface/institution-list-arms-groups-institutions-parent.interface.ts";

/** Institution List Arms Groups Institutions */
export interface InstitutionListArmsGroupsInstitutions {
  arm: InstitutionListArmsGroupsInstitutionsArm;
  basis: InstitutionListArmsGroupsInstitutionsBasis;
  children: Number;
  code: String;
  image?: String | null;
  kind: InstitutionListArmsGroupsInstitutionsKind;
  leaders: Number;
  name: String;
  parent?: InstitutionListArmsGroupsInstitutionsParent | null;
  purpose: String;
}
