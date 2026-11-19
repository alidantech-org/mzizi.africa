import type { Number } from "#/modules/shared/schema/type/number.type.ts";
import type { String } from "#/modules/shared/schema/type/string.type.ts";
import type { InstitutionDetailParentsRelation } from "#/modules/insights/schema/interface/institution-detail-parents-relation.interface.ts";

/** Institution Detail Parents */
export interface InstitutionDetailParents {
  children: Number;
  code: String;
  name: String;
  relation: InstitutionDetailParentsRelation;
}
