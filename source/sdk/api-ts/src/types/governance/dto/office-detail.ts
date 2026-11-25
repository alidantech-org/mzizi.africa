import type { GovernanceOfficeDetailHolders } from "#sdk/types/governance/dto/office-detail-holders.ts";
import type { GovernanceOfficeDetailNames } from "#sdk/types/governance/dto/office-detail-names.ts";

/** Office Detail */
export interface GovernanceOfficeDetail {
  code: string;
  featureId: string | null;
  holders: GovernanceOfficeDetailHolders[];
  institutionId: string;
  names: GovernanceOfficeDetailNames[];
  officeId: string;
  positionId: string;
  roleTerm: string;
  seat: string | null;
  termLimit: number | null;
  termYears: number | null;
}
