import type { GovernanceOfficeEntryHoldersNames } from "#sdk/types/governance/dto/office-entry-holders-names.ts";

/** Office Entry Holders */
export interface GovernanceOfficeEntryHolders {
  endsOn: string | null;
  fromYear: number | null;
  holderId: string;
  individualCode: string;
  individualId: string;
  methodTerm: string;
  names: GovernanceOfficeEntryHoldersNames[];
  startsOn: string | null;
  toYear: number | null;
}
