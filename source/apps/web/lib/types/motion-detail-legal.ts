import type { FieldMeta } from "#/lib/dryv/transport.ts";
import { type MotionDetailLegalFiscalYear } from "#/lib/types/motion-detail-legal-fiscal-year.ts";
import { type MotionDetailLegalProvision } from "#/lib/types/motion-detail-legal-provision.ts";

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
