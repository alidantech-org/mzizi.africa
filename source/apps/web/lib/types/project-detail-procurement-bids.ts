import type { FieldMeta } from "#/lib/dryv/transport.ts";

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
