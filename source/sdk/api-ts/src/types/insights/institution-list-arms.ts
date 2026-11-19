import type { InsightsInstitutionListArmsGroups } from "#sdk/types/insights/institution-list-arms-groups.ts";

/** Institution List Arms */
export interface InsightsInstitutionListArms {
  about: string;
  code: string;
  count: number;
  groups: InsightsInstitutionListArmsGroups[];
  label: string;
}
