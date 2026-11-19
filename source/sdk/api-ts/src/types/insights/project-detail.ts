import type { InsightsProjectDetailEvidence } from "#sdk/types/insights/project-detail-evidence.ts";
import type { InsightsProjectDetailMedia } from "#sdk/types/insights/project-detail-media.ts";
import type { InsightsProjectDetailProcurement } from "#sdk/types/insights/project-detail-procurement.ts";
import type { InsightsProjectDetailProject } from "#sdk/types/insights/project-detail-project.ts";

/** Project Detail */
export interface InsightsProjectDetail {
  evidence: InsightsProjectDetailEvidence[];
  gaps: string[];
  media: InsightsProjectDetailMedia[];
  money: unknown[];
  procurement: InsightsProjectDetailProcurement;
  project: InsightsProjectDetailProject;
}
