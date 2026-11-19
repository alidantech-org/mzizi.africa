import type { FieldMeta } from "#/_archives/lib/dryv/transport";
import { type ProjectDetailEvidence } from "#/_archives/lib/types/project-detail-evidence";
import { type ProjectDetailMedia } from "#/_archives/lib/types/project-detail-media";
import { type ProjectDetailProcurement } from "#/_archives/lib/types/project-detail-procurement";
import { type ProjectDetailProject } from "#/_archives/lib/types/project-detail-project";

/** Project Detail */
export interface ProjectDetail {
  evidence: ProjectDetailEvidence[];
  gaps: string[];
  media: ProjectDetailMedia[];
  money: unknown[];
  procurement: ProjectDetailProcurement;
  project: ProjectDetailProject;
}

/** Field metadata for forms and results. */
export const ProjectDetailFields: readonly FieldMeta[] = [
  { name: "evidence", label: "Evidence", kind: "other", required: true },
  { name: "gaps", label: "Gaps", kind: "string", required: true },
  { name: "media", label: "Media", kind: "other", required: true },
  { name: "money", label: "Money", kind: "other", required: true },
  { name: "procurement", label: "Procurement", kind: "other", required: true },
  { name: "project", label: "Project", kind: "other", required: true },
];
