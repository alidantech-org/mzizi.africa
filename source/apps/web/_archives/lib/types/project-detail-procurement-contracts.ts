import type { FieldMeta } from "#/_archives/lib/dryv/transport";

/** Project Detail Procurement Contracts */
export interface ProjectDetailProcurementContracts {
  amount: number;
  contractor: string;
  signedOn: string;
  status: string;
}

/** Field metadata for forms and results. */
export const ProjectDetailProcurementContractsFields: readonly FieldMeta[] = [
  { name: "amount", label: "Amount", kind: "number", required: true },
  { name: "contractor", label: "Contractor", kind: "string", required: true },
  { name: "signedOn", label: "Signed On", kind: "string", required: true },
  { name: "status", label: "Status", kind: "string", required: true },
];
