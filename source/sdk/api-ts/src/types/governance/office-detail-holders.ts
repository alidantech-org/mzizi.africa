import type { GovernanceOfficeDetailHoldersNames } from "#sdk/types/governance/office-detail-holders-names.ts";

/** Office Detail Holders */
export interface GovernanceOfficeDetailHolders {
  appointment: string;
  individualId: string;
  names: GovernanceOfficeDetailHoldersNames[];
  validFrom: string | null;
  validUntil: string | null;
}
