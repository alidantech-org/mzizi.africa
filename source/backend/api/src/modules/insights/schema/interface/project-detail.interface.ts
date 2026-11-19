import type { NonEmptyString500 } from "#/modules/shared/schema/type/non-empty-string500.type.ts";
import type { ProjectDetailEvidence } from "#/modules/insights/schema/interface/project-detail-evidence.interface.ts";
import type { ProjectDetailMedia } from "#/modules/insights/schema/interface/project-detail-media.interface.ts";
import type { ProjectDetailProcurement } from "#/modules/insights/schema/interface/project-detail-procurement.interface.ts";
import type { ProjectDetailProject } from "#/modules/insights/schema/interface/project-detail-project.interface.ts";

/** Project Detail */
export interface ProjectDetail {
  evidence: ProjectDetailEvidence[];
  gaps: NonEmptyString500[];
  media: ProjectDetailMedia[];
  money: unknown[];
  procurement: ProjectDetailProcurement;
  project: ProjectDetailProject;
}
