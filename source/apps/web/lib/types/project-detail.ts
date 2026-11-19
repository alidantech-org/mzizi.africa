import type { FieldMeta } from "#/lib/dryv/transport.ts";
import { type ProjectDetailEvidence } from "#/lib/types/project-detail-evidence.ts";
import { type ProjectDetailMedia } from "#/lib/types/project-detail-media.ts";
import { type ProjectDetailProcurement } from "#/lib/types/project-detail-procurement.ts";
import { type ProjectDetailProject } from "#/lib/types/project-detail-project.ts";

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
