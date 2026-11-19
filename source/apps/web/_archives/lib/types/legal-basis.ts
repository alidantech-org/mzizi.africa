import type { FieldMeta } from "#/_archives/lib/dryv/transport";
import { type LegalBasisItems } from "#/_archives/lib/types/legal-basis-items";
import { type LegalBasisSubject } from "#/_archives/lib/types/legal-basis-subject";

/** Legal Basis */
export interface LegalBasis {
  gaps: string[];
  items: LegalBasisItems[];
  subject: LegalBasisSubject;
}

/** Field metadata for forms and results. */
export const LegalBasisFields: readonly FieldMeta[] = [
  { name: "gaps", label: "Gaps", kind: "string", required: true },
  { name: "items", label: "Items", kind: "other", required: true },
  { name: "subject", label: "Subject", kind: "other", required: true },
];
