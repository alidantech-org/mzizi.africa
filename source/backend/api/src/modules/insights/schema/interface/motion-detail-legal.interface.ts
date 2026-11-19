import type { MotionDetailLegalFiscalYear } from "#/modules/insights/schema/interface/motion-detail-legal-fiscal-year.interface.ts";
import type { MotionDetailLegalProvision } from "#/modules/insights/schema/interface/motion-detail-legal-provision.interface.ts";

/** Motion Detail Legal */
export interface MotionDetailLegal {
  fiscalYear?: MotionDetailLegalFiscalYear | null;
  provision?: MotionDetailLegalProvision | null;
}
