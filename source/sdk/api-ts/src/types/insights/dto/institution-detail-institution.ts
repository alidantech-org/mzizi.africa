import type { InsightsInstitutionDetailInstitutionArm } from "#sdk/types/insights/dto/institution-detail-institution-arm.ts";
import type { InsightsInstitutionDetailInstitutionBasis } from "#sdk/types/insights/dto/institution-detail-institution-basis.ts";
import type { InsightsInstitutionDetailInstitutionKind } from "#sdk/types/insights/dto/institution-detail-institution-kind.ts";
import type { InsightsInstitutionDetailInstitutionParent } from "#sdk/types/insights/dto/institution-detail-institution-parent.ts";

/** Institution Detail Institution */
export interface InsightsInstitutionDetailInstitution {
  arm: InsightsInstitutionDetailInstitutionArm;
  basis: InsightsInstitutionDetailInstitutionBasis;
  children: number;
  code: string;
  established?: string | null;
  functions: string[];
  image?: string | null;
  kind: InsightsInstitutionDetailInstitutionKind;
  leaders: number;
  name: string;
  parent?: InsightsInstitutionDetailInstitutionParent | null;
  purpose: string;
}
