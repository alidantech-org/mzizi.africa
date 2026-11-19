import type { FieldMeta } from "#/_archives/lib/dryv/transport";

/** Place Civic Fund */
export interface PlaceCivicFund {
  code: string;
  funds: number;
  managedBy: string;
}

/** Field metadata for forms and results. */
export const PlaceCivicFundFields: readonly FieldMeta[] = [
  { name: "code", label: "Code", kind: "string", required: true },
  { name: "funds", label: "Funds", kind: "number", required: true },
  { name: "managedBy", label: "Managed By", kind: "string", required: true },
];
