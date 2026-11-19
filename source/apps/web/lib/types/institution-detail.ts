import type { FieldMeta } from "#/lib/dryv/transport.ts";
import { type InstitutionDetailChildren } from "#/lib/types/institution-detail-children.ts";
import { type InstitutionDetailContent } from "#/lib/types/institution-detail-content.ts";
import { type InstitutionDetailInstitution } from "#/lib/types/institution-detail-institution.ts";
import { type InstitutionDetailLeaders } from "#/lib/types/institution-detail-leaders.ts";
import { type InstitutionDetailLegalBasis } from "#/lib/types/institution-detail-legal-basis.ts";
import { type InstitutionDetailMetrics } from "#/lib/types/institution-detail-metrics.ts";
import { type InstitutionDetailParents } from "#/lib/types/institution-detail-parents.ts";

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
