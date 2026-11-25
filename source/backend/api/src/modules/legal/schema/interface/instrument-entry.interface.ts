import type { Id } from "#/modules/shared/schema/type/id.type.ts";
import type { IdentityCode } from "#/modules/shared/schema/type/identity-code.type.ts";
import type { Year } from "#/modules/shared/schema/type/year.type.ts";
import type { InstrumentEntryNames } from "#/modules/legal/schema/interface/instrument-entry-names.interface.ts";
import type { CalendarDate } from "#/modules/shared/schema/type/calendar-date.type.ts";

/** Instrument Entry */
export interface InstrumentEntry {
  code: IdentityCode;
  enactedOn: CalendarDate | null;
  fromYear: Year | null;
  instrumentId: Id;
  kindTerm: Id;
  names: InstrumentEntryNames[];
  statusTerm: Id | null;
}
