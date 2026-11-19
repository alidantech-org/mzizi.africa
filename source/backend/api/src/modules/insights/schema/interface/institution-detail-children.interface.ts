import type { Number } from "#/modules/shared/schema/type/number.type.ts";
import type { String } from "#/modules/shared/schema/type/string.type.ts";
import type { InstitutionDetailChildrenRelation } from "#/modules/insights/schema/interface/institution-detail-children-relation.interface.ts";

/** Institution Detail Children */
export interface InstitutionDetailChildren {
  children: Number;
  code: String;
  name: String;
  relation: InstitutionDetailChildrenRelation;
}
