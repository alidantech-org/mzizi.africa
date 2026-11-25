import type { GovernanceOfficeDetailHoldersNames } from "#sdk/types/governance/dto/office-detail-holders-names.ts";
import type { GovernanceOfficeDetailHoldersSteps } from "#sdk/types/governance/dto/office-detail-holders-steps.ts";

/** Office Detail Holders */
export interface GovernanceOfficeDetailHolders {
  endsOn: string | null;
  fromYear: number | null;
  holderId: string;
  individualCode: string;
  individualId: string;
  methodTerm: string;
  names: GovernanceOfficeDetailHoldersNames[];
  startsOn: string | null;
  steps: GovernanceOfficeDetailHoldersSteps[];
  toYear: number | null;
}
