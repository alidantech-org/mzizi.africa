import { SharedDatePrecision } from "#sdk/types/shared/enums/date-precision.ts";

/** Institution Detail Mandates */
export interface GovernanceInstitutionDetailMandates {
  description: string;
  fromToPrecision: SharedDatePrecision | null;
  fromYear: number | null;
  kind: string;
  toYear: number | null;
}
