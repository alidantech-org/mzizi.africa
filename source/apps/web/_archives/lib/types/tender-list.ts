import type { FieldMeta } from "#/_archives/lib/dryv/transport";
import { type TenderListSummary } from "#/_archives/lib/types/tender-list-summary";
import { type TenderListTenders } from "#/_archives/lib/types/tender-list-tenders";

/** Tender List */
export interface TenderList {
  gaps: string[];
  summary: TenderListSummary;
  tenders: TenderListTenders[];
}

/** Field metadata for forms and results. */
export const TenderListFields: readonly FieldMeta[] = [
  { name: "gaps", label: "Gaps", kind: "string", required: true },
  { name: "summary", label: "Summary", kind: "other", required: true },
  { name: "tenders", label: "Tenders", kind: "other", required: true },
];
