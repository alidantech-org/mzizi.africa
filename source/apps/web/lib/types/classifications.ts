import type { FieldMeta } from "#/lib/dryv/transport.ts";

/** One dated classification of a feature by a scheme value, so a feature can answer several classification questions and change over time. */
export interface Classifications {
  createdAt: string;
  deletedAt?: string | null;
  featureId: string;
  id: string;
  updatedAt: string;
  validFrom?: string | null;
  validFromEarliest?: string | null;
  validFromLatest?: string | null;
  validUntil?: string | null;
  validUntilEarliest?: string | null;
  validUntilLatest?: string | null;
  valueId: string;
  version: number;
}

/** Field metadata for forms and results. */
export const ClassificationsFields: readonly FieldMeta[] = [
  { name: "createdAt", label: "Created At", kind: "date", required: true },
  { name: "deletedAt", label: "Deleted At", kind: "date", required: false },
  { name: "featureId", label: "Feature Id", kind: "string", required: true },
  { name: "id", label: "Id", kind: "string", required: true },
  { name: "updatedAt", label: "Updated At", kind: "date", required: true },
  { name: "validFrom", label: "Valid From", kind: "date", required: false },
  { name: "validFromEarliest", label: "Valid From Earliest", kind: "date", required: false },
  { name: "validFromLatest", label: "Valid From Latest", kind: "date", required: false },
  { name: "validUntil", label: "Valid Until", kind: "date", required: false },
  { name: "validUntilEarliest", label: "Valid Until Earliest", kind: "date", required: false },
  { name: "validUntilLatest", label: "Valid Until Latest", kind: "date", required: false },
  { name: "valueId", label: "Value Id", kind: "string", required: true },
  { name: "version", label: "Version", kind: "number", required: true },
];
