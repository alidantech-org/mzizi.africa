import type { FieldMeta } from "#/lib/dryv/transport.ts";

/** Institution Detail */
export interface InstitutionDetail {
  children: unknown[];
  content: unknown[];
  gaps: string[];
  institution: unknown;
  leaders: unknown[];
  legalBasis: unknown[];
  metrics: unknown[];
  parents: unknown[];
}

/** Field metadata for forms and results. */
export const InstitutionDetailFields: readonly FieldMeta[] = [
  { name: "children", label: "Children", kind: "other", required: true },
  { name: "content", label: "Content", kind: "other", required: true },
  { name: "gaps", label: "Gaps", kind: "string", required: true },
  { name: "institution", label: "Institution", kind: "other", required: true },
  { name: "leaders", label: "Leaders", kind: "other", required: true },
  { name: "legalBasis", label: "Legal Basis", kind: "other", required: true },
  { name: "metrics", label: "Metrics", kind: "other", required: true },
  { name: "parents", label: "Parents", kind: "other", required: true },
];
