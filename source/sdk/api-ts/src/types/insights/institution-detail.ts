import type { InsightsInstitutionDetailChildren } from "#sdk/types/insights/institution-detail-children.ts";
import type { InsightsInstitutionDetailContent } from "#sdk/types/insights/institution-detail-content.ts";
import type { InsightsInstitutionDetailInstitution } from "#sdk/types/insights/institution-detail-institution.ts";
import type { InsightsInstitutionDetailLeaders } from "#sdk/types/insights/institution-detail-leaders.ts";
import type { InsightsInstitutionDetailLegalBasis } from "#sdk/types/insights/institution-detail-legal-basis.ts";
import type { InsightsInstitutionDetailMetrics } from "#sdk/types/insights/institution-detail-metrics.ts";
import type { InsightsInstitutionDetailParents } from "#sdk/types/insights/institution-detail-parents.ts";

/** Institution Detail */
export interface InsightsInstitutionDetail {
  children: InsightsInstitutionDetailChildren[];
  content: InsightsInstitutionDetailContent[];
  gaps: string[];
  institution: InsightsInstitutionDetailInstitution;
  leaders: InsightsInstitutionDetailLeaders[];
  legalBasis: InsightsInstitutionDetailLegalBasis[];
  metrics: InsightsInstitutionDetailMetrics[];
  parents: InsightsInstitutionDetailParents[];
}
