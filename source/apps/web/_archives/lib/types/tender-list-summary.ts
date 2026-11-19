import type { FieldMeta } from "#/_archives/lib/dryv/transport";
import { type TenderListSummaryByStatus } from "#/_archives/lib/types/tender-list-summary-by-status";
import { type TenderListSummaryTransparency } from "#/_archives/lib/types/tender-list-summary-transparency";

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
  {
    name: "transparency",
    label: "Transparency",
    kind: "other",
    required: true,
  },
];
