import type { FieldMeta } from "#/lib/dryv/transport.ts";
import { type ProcurementItem } from "#/lib/types/procurement-item.ts";

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
  { name: "totalAmount", label: "Total Amount", kind: "number", required: false },
];
