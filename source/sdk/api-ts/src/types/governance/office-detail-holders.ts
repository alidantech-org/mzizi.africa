import { SharedDatePrecision } from "#sdk/types/enums/shared/date-precision.ts";
import type { GovernanceOfficeDetailHoldersNames } from "#sdk/types/governance/office-detail-holders-names.ts";

/** Office Detail Holders */
export interface GovernanceOfficeDetailHolders {
  appointment: string;
  fromToPrecision: SharedDatePrecision | null;
  fromYear: number | null;
  individualId: string;
  names: GovernanceOfficeDetailHoldersNames[];
  toYear: number | null;
}
