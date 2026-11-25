import type { CivicProjectDetailContracts } from "#sdk/types/civic/dto/project-detail-contracts.ts";
import type { CivicProjectDetailNames } from "#sdk/types/civic/dto/project-detail-names.ts";
import type { CivicProjectDetailSites } from "#sdk/types/civic/dto/project-detail-sites.ts";

/** Project Detail */
export interface CivicProjectDetail {
  code: string;
  contracts: CivicProjectDetailContracts[];
  fromYear: number | null;
  implementerId: string | null;
  institutionId: string | null;
  names: CivicProjectDetailNames[];
  projectId: string;
  sites: CivicProjectDetailSites[];
  sponsorId: string | null;
  statusTerm: string;
  toYear: number | null;
}
