import type { LocalityProcurementItem } from "#sdk/types/locality/procurement-item.ts";

/** Procurement Summary */
export interface LocalityProcurementSummary {
  count: number;
  currency?: string | null;
  recent: LocalityProcurementItem[];
  totalAmount?: number | null;
}
