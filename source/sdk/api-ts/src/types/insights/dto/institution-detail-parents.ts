import type { InsightsInstitutionDetailParentsRelation } from "#sdk/types/insights/dto/institution-detail-parents-relation.ts";

/** Institution Detail Parents */
export interface InsightsInstitutionDetailParents {
  children: number;
  code: string;
  name: string;
  relation: InsightsInstitutionDetailParentsRelation;
}
