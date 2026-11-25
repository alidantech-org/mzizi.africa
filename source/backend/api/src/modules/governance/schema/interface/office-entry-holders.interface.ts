import type { Id } from "#/modules/shared/schema/type/id.type.ts";
import type { IdentityCode } from "#/modules/shared/schema/type/identity-code.type.ts";
import type { Year } from "#/modules/shared/schema/type/year.type.ts";
import type { OfficeEntryHoldersNames } from "#/modules/governance/schema/interface/office-entry-holders-names.interface.ts";
import type { CalendarDate } from "#/modules/shared/schema/type/calendar-date.type.ts";

/** Office Entry Holders */
export interface OfficeEntryHolders {
  endsOn: CalendarDate | null;
  fromYear: Year | null;
  holderId: Id;
  individualCode: IdentityCode;
  individualId: Id;
  methodTerm: Id;
  names: OfficeEntryHoldersNames[];
  startsOn: CalendarDate | null;
  toYear: Year | null;
}
