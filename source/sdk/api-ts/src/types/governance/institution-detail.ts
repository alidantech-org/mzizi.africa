import type { GovernanceInstitutionDetailMandates } from "#sdk/types/governance/institution-detail-mandates.ts";
import type { GovernanceInstitutionDetailNames } from "#sdk/types/governance/institution-detail-names.ts";
import type { GovernanceInstitutionDetailOffices } from "#sdk/types/governance/institution-detail-offices.ts";

/** Institution Detail */
export interface GovernanceInstitutionDetail {
  code: string;
  id: string;
  kind: string;
  mandates: GovernanceInstitutionDetailMandates[];
  names: GovernanceInstitutionDetailNames[];
  offices: GovernanceInstitutionDetailOffices[];
  validFrom: string | null;
  validUntil: string | null;
}
