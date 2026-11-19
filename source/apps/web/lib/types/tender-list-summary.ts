import type { FieldMeta } from "#/lib/dryv/transport.ts";
import { type TenderListSummaryByStatus } from "#/lib/types/tender-list-summary-by-status.ts";
import { type TenderListSummaryTransparency } from "#/lib/types/tender-list-summary-transparency.ts";

/** Tender List Summary */
export interface TenderListSummary {
  byStatus: TenderListSummaryByStatus[];
  total: number;
  transparency: TenderListSummaryTransparency;
}

/** Field metadata for forms and results. */
export const TenderListSummaryFields: readonly FieldMeta[] = [
  { name: "byStatus", label: "By Status", kind: "other", required: true },
  { name: "total", label: "Total", kind: "number", required: true },
  { name: "transparency", label: "Transparency", kind: "other", required: true },
];
