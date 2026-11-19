import type { FieldMeta } from "#/lib/dryv/transport.ts";

/** Tender List Summary By Status */
export interface TenderListSummaryByStatus {
  count: number;
  status: string;
  valueKes: number;
}

/** Field metadata for forms and results. */
export const TenderListSummaryByStatusFields: readonly FieldMeta[] = [
  { name: "count", label: "Count", kind: "number", required: true },
  { name: "status", label: "Status", kind: "string", required: true },
  { name: "valueKes", label: "Value Kes", kind: "number", required: true },
];
