import type { InsightsInstitutionDetailChildrenRelation } from "#sdk/types/insights/dto/institution-detail-children-relation.ts";

/** Institution Detail Children */
export interface InsightsInstitutionDetailChildren {
  children: number;
  code: string;
  name: string;
  relation: InsightsInstitutionDetailChildrenRelation;
}
