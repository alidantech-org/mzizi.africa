import type { GovernanceOfficeEntryHolders } from "#sdk/types/governance/dto/office-entry-holders.ts";
import type { GovernanceOfficeEntryNames } from "#sdk/types/governance/dto/office-entry-names.ts";

/** Office Entry */
export interface GovernanceOfficeEntry {
  code: string;
  holders: GovernanceOfficeEntryHolders[];
  institutionCode: string;
  institutionId: string;
  methodTerm: string | null;
  names: GovernanceOfficeEntryNames[];
  officeId: string;
  order: number | null;
  roleTerm: string;
  seat: string | null;
}
