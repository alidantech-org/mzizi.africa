import type { InsightsInstitutionDetailLeadersHow } from "#sdk/types/insights/institution-detail-leaders-how.ts";
import type { InsightsInstitutionDetailLeadersTier } from "#sdk/types/insights/institution-detail-leaders-tier.ts";
import type { InsightsInstitutionDetailLeadersUnit } from "#sdk/types/insights/institution-detail-leaders-unit.ts";

/** Institution Detail Leaders */
export interface InsightsInstitutionDetailLeaders {
  holderId: string;
  how: InsightsInstitutionDetailLeadersHow;
  leaderSlug: string;
  name: string;
  officeCode: string;
  party?: string | null;
  photo: string;
  since: string;
  tier: InsightsInstitutionDetailLeadersTier;
  unit?: InsightsInstitutionDetailLeadersUnit | null;
}
