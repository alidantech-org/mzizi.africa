import type { Number } from "#/modules/shared/schema/type/number.type.ts";
import type { String } from "#/modules/shared/schema/type/string.type.ts";
import type { InstitutionDetailInstitutionArm } from "#/modules/insights/schema/interface/institution-detail-institution-arm.interface.ts";
import type { InstitutionDetailInstitutionBasis } from "#/modules/insights/schema/interface/institution-detail-institution-basis.interface.ts";
import type { InstitutionDetailInstitutionKind } from "#/modules/insights/schema/interface/institution-detail-institution-kind.interface.ts";
import type { InstitutionDetailInstitutionParent } from "#/modules/insights/schema/interface/institution-detail-institution-parent.interface.ts";

/** Institution Detail Institution */
export interface InstitutionDetailInstitution {
  arm: InstitutionDetailInstitutionArm;
  basis: InstitutionDetailInstitutionBasis;
  children: Number;
  code: String;
  established?: String | null;
  functions: String[];
  image?: String | null;
  kind: InstitutionDetailInstitutionKind;
  leaders: Number;
  name: String;
  parent?: InstitutionDetailInstitutionParent | null;
  purpose: String;
}
