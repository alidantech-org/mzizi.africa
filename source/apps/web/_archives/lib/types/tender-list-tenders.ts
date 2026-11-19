import type { FieldMeta } from "#/_archives/lib/dryv/transport";

/** Tender List Tenders */
export interface TenderListTenders {
  amount?: number | null;
  awardedOn?: string | null;
  bids: number;
  buyer: string;
  closesOn: string;
  code: string;
  disclosed: number;
  disclosedOf: number;
  place?: string | null;
  procedure: string;
  publishedOn: string;
  reference?: string | null;
  status: string;
  supplier?: string | null;
  title: string;
}

/** Field metadata for forms and results. */
export const TenderListTendersFields: readonly FieldMeta[] = [
  { name: "amount", label: "Amount", kind: "number", required: false },
  { name: "awardedOn", label: "Awarded On", kind: "string", required: false },
  { name: "bids", label: "Bids", kind: "number", required: true },
  { name: "buyer", label: "Buyer", kind: "string", required: true },
  { name: "closesOn", label: "Closes On", kind: "string", required: true },
  { name: "code", label: "Code", kind: "string", required: true },
  { name: "disclosed", label: "Disclosed", kind: "number", required: true },
  {
    name: "disclosedOf",
    label: "Disclosed Of",
    kind: "number",
    required: true,
  },
  { name: "place", label: "Place", kind: "string", required: false },
  { name: "procedure", label: "Procedure", kind: "string", required: true },
  {
    name: "publishedOn",
    label: "Published On",
    kind: "string",
    required: true,
  },
  { name: "reference", label: "Reference", kind: "string", required: false },
  { name: "status", label: "Status", kind: "string", required: true },
  { name: "supplier", label: "Supplier", kind: "string", required: false },
  { name: "title", label: "Title", kind: "string", required: true },
];
