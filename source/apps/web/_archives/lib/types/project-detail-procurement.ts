import type { FieldMeta } from "#/_archives/lib/dryv/transport";
import { type ProjectDetailProcurementBids } from "#/_archives/lib/types/project-detail-procurement-bids";
import { type ProjectDetailProcurementContracts } from "#/_archives/lib/types/project-detail-procurement-contracts";

/** Project Detail Procurement */
export interface ProjectDetailProcurement {
  awardedOn?: string | null;
  bids: ProjectDetailProcurementBids[];
  buyer: string;
  closesOn: string;
  code: string;
  contracts: ProjectDetailProcurementContracts[];
  procedure: string;
  publishedOn: string;
  reference?: string | null;
  status: string;
  title?: string | null;
}

/** Field metadata for forms and results. */
export const ProjectDetailProcurementFields: readonly FieldMeta[] = [
  { name: "awardedOn", label: "Awarded On", kind: "string", required: false },
  { name: "bids", label: "Bids", kind: "other", required: true },
  { name: "buyer", label: "Buyer", kind: "string", required: true },
  { name: "closesOn", label: "Closes On", kind: "string", required: true },
  { name: "code", label: "Code", kind: "string", required: true },
  { name: "contracts", label: "Contracts", kind: "other", required: true },
  { name: "procedure", label: "Procedure", kind: "string", required: true },
  {
    name: "publishedOn",
    label: "Published On",
    kind: "string",
    required: true,
  },
  { name: "reference", label: "Reference", kind: "string", required: false },
  { name: "status", label: "Status", kind: "string", required: true },
  { name: "title", label: "Title", kind: "string", required: false },
];
