import type { FieldMeta } from "#/_archives/lib/dryv/transport";

/** Institution Detail Legal Basis */
export interface InstitutionDetailLegalBasis {
  designation: string;
  effect: string;
  effectCode?: string;
  excerpt: string;
  explanation?: string;
  heading?: string | null;
  instrument: string;
  instrumentCode?: string | null;
  provisionCode?: string | null;
  reviewStatus: string;
  type: string;
  via?: string | null;
}

/** Field metadata for forms and results. */
export const InstitutionDetailLegalBasisFields: readonly FieldMeta[] = [
  { name: "designation", label: "Designation", kind: "string", required: true },
  { name: "effect", label: "Effect", kind: "string", required: true },
  { name: "effectCode", label: "Effect Code", kind: "string", required: false },
  { name: "excerpt", label: "Excerpt", kind: "string", required: true },
  {
    name: "explanation",
    label: "Explanation",
    kind: "string",
    required: false,
  },
  { name: "heading", label: "Heading", kind: "string", required: false },
  { name: "instrument", label: "Instrument", kind: "string", required: true },
  {
    name: "instrumentCode",
    label: "Instrument Code",
    kind: "string",
    required: false,
  },
  {
    name: "provisionCode",
    label: "Provision Code",
    kind: "string",
    required: false,
  },
  {
    name: "reviewStatus",
    label: "Review Status",
    kind: "string",
    required: true,
  },
  { name: "type", label: "Type", kind: "string", required: true },
  { name: "via", label: "Via", kind: "string", required: false },
];
