import type { FieldMeta } from "#/_archives/lib/dryv/transport";

/** Project Detail Procurement Bids */
export interface ProjectDetailProcurementBids {
  amount: number;
  bidder: string;
  outcome: string;
}

/** Field metadata for forms and results. */
export const ProjectDetailProcurementBidsFields: readonly FieldMeta[] = [
  { name: "amount", label: "Amount", kind: "number", required: true },
  { name: "bidder", label: "Bidder", kind: "string", required: true },
  { name: "outcome", label: "Outcome", kind: "string", required: true },
];
