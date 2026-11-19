import type { FieldMeta } from "#/lib/dryv/transport.ts";
import { type LegalBasisItems } from "#/lib/types/legal-basis-items.ts";
import { type LegalBasisSubject } from "#/lib/types/legal-basis-subject.ts";

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
