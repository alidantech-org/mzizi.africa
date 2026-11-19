import type { FieldMeta } from "#/lib/dryv/transport.ts";

/** Tender List Summary Transparency */
export interface TenderListSummaryTransparency {
  listed: number;
  withContract: number;
}

/** Field metadata for forms and results. */
export const TenderListSummaryTransparencyFields: readonly FieldMeta[] = [
  { name: "listed", label: "Listed", kind: "number", required: true },
  { name: "withContract", label: "With Contract", kind: "number", required: true },
];
