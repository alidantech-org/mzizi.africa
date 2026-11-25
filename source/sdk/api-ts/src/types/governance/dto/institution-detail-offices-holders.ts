import type { GovernanceInstitutionDetailOfficesHoldersNames } from "#sdk/types/governance/dto/institution-detail-offices-holders-names.ts";

/** Institution Detail Offices Holders */
export interface GovernanceInstitutionDetailOfficesHolders {
  endsOn: string | null;
  fromYear: number | null;
  holderId: string;
  individualCode: string;
  individualId: string;
  methodTerm: string;
  names: GovernanceInstitutionDetailOfficesHoldersNames[];
  startsOn: string | null;
  toYear: number | null;
}
