import type { GovernanceInstitutionDetailNames } from "#sdk/types/governance/dto/institution-detail-names.ts";
import type { GovernanceInstitutionDetailOffices } from "#sdk/types/governance/dto/institution-detail-offices.ts";

/** Institution Detail */
export interface GovernanceInstitutionDetail {
  armTerm: string | null;
  basisTerm: string | null;
  classTerm: string | null;
  code: string;
  countryId: string;
  fromYear: number | null;
  institutionId: string;
  kindTerm: string;
  names: GovernanceInstitutionDetailNames[];
  offices: GovernanceInstitutionDetailOffices[];
  toYear: number | null;
}
