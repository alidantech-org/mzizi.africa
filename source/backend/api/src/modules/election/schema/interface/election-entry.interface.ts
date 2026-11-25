import type { Id } from "#/modules/shared/schema/type/id.type.ts";
import type { IdentityCode } from "#/modules/shared/schema/type/identity-code.type.ts";
import type { Year } from "#/modules/shared/schema/type/year.type.ts";
import type { ElectionEntryNames } from "#/modules/election/schema/interface/election-entry-names.interface.ts";
import type { CalendarDate } from "#/modules/shared/schema/type/calendar-date.type.ts";

/** Election Entry */
export interface ElectionEntry {
  code: IdentityCode;
  electionId: Id;
  eventId: Id | null;
  fromYear: Year;
  heldOn: CalendarDate | null;
  kindTerm: Id;
  names: ElectionEntryNames[];
  statusTerm: Id;
}
