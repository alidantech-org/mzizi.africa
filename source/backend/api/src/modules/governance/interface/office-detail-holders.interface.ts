
import type { Id } from "#/modules/shared/type/id.type.ts";
import type { IdentityCode } from "#/modules/shared/type/identity-code.type.ts";
import type { OfficeDetailHoldersNames } from "#/modules/governance/interface/office-detail-holders-names.interface.ts";
import type { CalendarDate } from "#/modules/shared/type/calendar-date.type.ts";

/** Office Detail Holders */
export interface OfficeDetailHolders {
  appointment: IdentityCode;
  individualId: Id;
  names: OfficeDetailHoldersNames[];
  validFrom: CalendarDate | null;
  validUntil: CalendarDate | null;
}