import type { FieldMeta } from "#/lib/dryv/transport.ts";

/** Party Detail Funding */
export interface PartyDetailFunding {
  amountKes: number;
  year: number;
}

/** Field metadata for forms and results. */
export const PartyDetailFundingFields: readonly FieldMeta[] = [
  { name: "amountKes", label: "Amount Kes", kind: "number", required: true },
  { name: "year", label: "Year", kind: "number", required: true },
];
