import type { DatePrecision } from "#/modules/shared/schema/enum/date-precision.enum.ts";
import type { Id } from "#/modules/shared/schema/type/id.type.ts";
import type { IdentityCode } from "#/modules/shared/schema/type/identity-code.type.ts";
import type { Year } from "#/modules/shared/schema/type/year.type.ts";
import type { HistoryEntryNames } from "#/modules/history/schema/interface/history-entry-names.interface.ts";
import type { CalendarDate } from "#/modules/shared/schema/type/calendar-date.type.ts";

/** History Entry */
export interface HistoryEntry {
  code: IdentityCode;
  fromYear: Year | null;
  kindTerm: Id;
  names: HistoryEntryNames[];
  occurrenceId: Id;
  precision: DatePrecision;
  startsOn: CalendarDate | null;
  toYear: Year | null;
}
