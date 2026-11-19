import type { FieldMeta } from "#/_archives/lib/dryv/transport";
import { type MotionDetailLegalFiscalYear } from "#/_archives/lib/types/motion-detail-legal-fiscal-year";
import { type MotionDetailLegalProvision } from "#/_archives/lib/types/motion-detail-legal-provision";

/** Motion Detail Legal */
export interface MotionDetailLegal {
  fiscalYear?: MotionDetailLegalFiscalYear | null;
  provision?: MotionDetailLegalProvision | null;
}

/** Field metadata for forms and results. */
export const MotionDetailLegalFields: readonly FieldMeta[] = [
  { name: "fiscalYear", label: "Fiscal Year", kind: "other", required: false },
  { name: "provision", label: "Provision", kind: "other", required: false },
];
