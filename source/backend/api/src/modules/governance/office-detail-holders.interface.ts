
import type { Id } from "#/modules/shared/id.type.ts";
import type { IdentityCode } from "#/modules/shared/identity-code.type.ts";
import type { OfficeDetailHoldersNames } from "#/modules/governance/office-detail-holders-names.interface.ts";
import type { CalendarDate } from "#/modules/shared/calendar-date.type.ts";

/** Office Detail Holders */
export interface OfficeDetailHolders {
  appointment: IdentityCode;
  individualId: Id;
  names: OfficeDetailHoldersNames[];
  validFrom: CalendarDate | null;
  validUntil: CalendarDate | null;
}