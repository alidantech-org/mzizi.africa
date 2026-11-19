import type { FieldMeta } from "#/_archives/lib/dryv/transport";
import { type ProcurementItem } from "#/_archives/lib/types/procurement-item";

/** Procurement Summary */
export interface ProcurementSummary {
  count: number;
  currency?: string | null;
  recent: ProcurementItem[];
  totalAmount?: number | null;
}

/** Field metadata for forms and results. */
export const ProcurementSummaryFields: readonly FieldMeta[] = [
  { name: "count", label: "Count", kind: "number", required: true },
  { name: "currency", label: "Currency", kind: "string", required: false },
  { name: "recent", label: "Recent", kind: "other", required: true },
  {
    name: "totalAmount",
    label: "Total Amount",
    kind: "number",
    required: false,
  },
];
