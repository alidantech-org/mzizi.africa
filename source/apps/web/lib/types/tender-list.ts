import type { FieldMeta } from "#/lib/dryv/transport.ts";
import { type TenderListSummary } from "#/lib/types/tender-list-summary.ts";
import { type TenderListTenders } from "#/lib/types/tender-list-tenders.ts";

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
