import type { FieldMeta } from "#/lib/dryv/transport.ts";

/** Legal Basis */
export interface LegalBasis {
  gaps: string[];
  items: unknown[];
  subject: unknown;
}

/** Field metadata for forms and results. */
export const LegalBasisFields: readonly FieldMeta[] = [
  { name: "gaps", label: "Gaps", kind: "string", required: true },
  { name: "items", label: "Items", kind: "other", required: true },
  { name: "subject", label: "Subject", kind: "other", required: true },
];
