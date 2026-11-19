import type { FieldMeta } from "#/_archives/lib/dryv/transport";
import { type EvidenceRef } from "#/_archives/lib/types/evidence-ref";

/** Procurement Item */
export interface ProcurementItem {
  amount?: number | null;
  awardedTo?: string | null;
  currency?: string | null;
  evidence: EvidenceRef[];
  procurementId: string;
  status?: string | null;
  title: string;
  year?: number | null;
}

/** Field metadata for forms and results. */
export const ProcurementItemFields: readonly FieldMeta[] = [
  { name: "amount", label: "Amount", kind: "number", required: false },
  { name: "awardedTo", label: "Awarded To", kind: "string", required: false },
  { name: "currency", label: "Currency", kind: "string", required: false },
  { name: "evidence", label: "Evidence", kind: "other", required: true },
  {
    name: "procurementId",
    label: "Procurement Id",
    kind: "string",
    required: true,
  },
  { name: "status", label: "Status", kind: "string", required: false },
  { name: "title", label: "Title", kind: "string", required: true },
  { name: "year", label: "Year", kind: "number", required: false },
];
