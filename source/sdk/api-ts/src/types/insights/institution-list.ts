import type { InsightsInstitutionListArms } from "#sdk/types/insights/institution-list-arms.ts";

/** Institution List */
export interface InsightsInstitutionList {
  arms: InsightsInstitutionListArms[];
  gaps: string[];
  total: number;
}
