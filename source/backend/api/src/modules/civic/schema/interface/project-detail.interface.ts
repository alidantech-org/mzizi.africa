import type { Id } from "#/modules/shared/schema/type/id.type.ts";
import type { IdentityCode } from "#/modules/shared/schema/type/identity-code.type.ts";
import type { Year } from "#/modules/shared/schema/type/year.type.ts";
import type { ProjectDetailContracts } from "#/modules/civic/schema/interface/project-detail-contracts.interface.ts";
import type { ProjectDetailNames } from "#/modules/civic/schema/interface/project-detail-names.interface.ts";
import type { ProjectDetailSites } from "#/modules/civic/schema/interface/project-detail-sites.interface.ts";

/** Project Detail */
export interface ProjectDetail {
  code: IdentityCode;
  contracts: ProjectDetailContracts[];
  fromYear: Year | null;
  implementerId: Id | null;
  institutionId: Id | null;
  names: ProjectDetailNames[];
  projectId: Id;
  sites: ProjectDetailSites[];
  sponsorId: Id | null;
  statusTerm: Id;
  toYear: Year | null;
}
