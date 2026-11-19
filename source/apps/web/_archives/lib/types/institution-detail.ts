import type { FieldMeta } from "#/_archives/lib/dryv/transport";
import { type InstitutionDetailChildren } from "#/_archives/lib/types/institution-detail-children";
import { type InstitutionDetailContent } from "#/_archives/lib/types/institution-detail-content";
import { type InstitutionDetailInstitution } from "#/_archives/lib/types/institution-detail-institution";
import { type InstitutionDetailLeaders } from "#/_archives/lib/types/institution-detail-leaders";
import { type InstitutionDetailLegalBasis } from "#/_archives/lib/types/institution-detail-legal-basis";
import { type InstitutionDetailMetrics } from "#/_archives/lib/types/institution-detail-metrics";
import { type InstitutionDetailParents } from "#/_archives/lib/types/institution-detail-parents";

/** Institution Detail */
export interface InstitutionDetail {
  children: InstitutionDetailChildren[];
  content: InstitutionDetailContent[];
  gaps: string[];
  institution: InstitutionDetailInstitution;
  leaders: InstitutionDetailLeaders[];
  legalBasis: InstitutionDetailLegalBasis[];
  metrics: InstitutionDetailMetrics[];
  parents: InstitutionDetailParents[];
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
