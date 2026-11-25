import type { GovernanceInstitutionDetailOfficesHolders } from "#sdk/types/governance/dto/institution-detail-offices-holders.ts";
import type { GovernanceInstitutionDetailOfficesNames } from "#sdk/types/governance/dto/institution-detail-offices-names.ts";

/** Institution Detail Offices */
export interface GovernanceInstitutionDetailOffices {
  code: string;
  featureId: string | null;
  holders: GovernanceInstitutionDetailOfficesHolders[];
  names: GovernanceInstitutionDetailOfficesNames[];
  officeId: string;
  order: number | null;
  roleTerm: string;
  seat: string | null;
}
