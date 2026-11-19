import type { Number } from "#/modules/shared/schema/type/number.type.ts";
import type { String } from "#/modules/shared/schema/type/string.type.ts";
import type { InstitutionListArmsGroups } from "#/modules/insights/schema/interface/institution-list-arms-groups.interface.ts";

/** Institution List Arms */
export interface InstitutionListArms {
  about: String;
  code: String;
  count: Number;
  groups: InstitutionListArmsGroups[];
  label: String;
}
