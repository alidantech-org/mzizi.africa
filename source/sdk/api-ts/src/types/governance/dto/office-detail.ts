import type { GovernanceOfficeDetailHolders } from "#sdk/types/governance/dto/office-detail-holders.ts";

/** Office Detail */
export interface GovernanceOfficeDetail {
  code: string;
  holders: GovernanceOfficeDetailHolders[];
  id: string;
  institutionId: string;
  kind: string;
  unitFeatureId: string | null;
}
