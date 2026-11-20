import { SharedDatePrecision } from "#sdk/types/shared/enums/date-precision.ts";
import type { GovernanceInstitutionDetailMandates } from "#sdk/types/governance/dto/institution-detail-mandates.ts";
import type { GovernanceInstitutionDetailNames } from "#sdk/types/governance/dto/institution-detail-names.ts";
import type { GovernanceInstitutionDetailOffices } from "#sdk/types/governance/dto/institution-detail-offices.ts";

/** Institution Detail */
export interface GovernanceInstitutionDetail {
  code: string;
  fromToPrecision: SharedDatePrecision | null;
  fromYear: number | null;
  id: string;
  kind: string;
  mandates: GovernanceInstitutionDetailMandates[];
  names: GovernanceInstitutionDetailNames[];
  offices: GovernanceInstitutionDetailOffices[];
  toYear: number | null;
}
