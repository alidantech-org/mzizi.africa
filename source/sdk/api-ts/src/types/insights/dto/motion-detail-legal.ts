import type { InsightsMotionDetailLegalFiscalYear } from "#sdk/types/insights/dto/motion-detail-legal-fiscal-year.ts";
import type { InsightsMotionDetailLegalProvision } from "#sdk/types/insights/dto/motion-detail-legal-provision.ts";

/** Motion Detail Legal */
export interface InsightsMotionDetailLegal {
  fiscalYear?: InsightsMotionDetailLegalFiscalYear | null;
  provision?: InsightsMotionDetailLegalProvision | null;
}
