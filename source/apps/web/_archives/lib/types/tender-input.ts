import type { FieldMeta } from "#/_archives/lib/dryv/transport";

/** Tender Input */
export interface TenderInput {
  featureId?: string;
  limit?: number;
  status?: string;
}

/** Field metadata for forms and results. */
export const TenderInputFields: readonly FieldMeta[] = [
  { name: "featureId", label: "Feature Id", kind: "string", required: false },
  { name: "limit", label: "Limit", kind: "number", required: false },
  { name: "status", label: "Status", kind: "string", required: false },
];
