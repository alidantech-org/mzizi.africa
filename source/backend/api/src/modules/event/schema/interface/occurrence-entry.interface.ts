import type { Flag } from "#/modules/shared/schema/type/flag.type.ts";
import type { Id } from "#/modules/shared/schema/type/id.type.ts";
import type { IdentityCode } from "#/modules/shared/schema/type/identity-code.type.ts";
import type { OccurrenceEntryNames } from "#/modules/event/schema/interface/occurrence-entry-names.interface.ts";
import type { CalendarDate } from "#/modules/shared/schema/type/calendar-date.type.ts";
import type { Instant } from "#/modules/shared/schema/type/instant.type.ts";

/** Occurrence Entry */
export interface OccurrenceEntry {
  actualStartsOn: CalendarDate | null;
  eventCode: IdentityCode;
  eventId: Id;
  featureId: Id | null;
  isAllDay: Flag;
  kindTerm: Id;
  names: OccurrenceEntryNames[];
  occurrenceId: Id;
  plannedEndsOn: CalendarDate | null;
  plannedStartsOn: CalendarDate;
  startsAt: Instant | null;
  statusTerm: Id;
}
