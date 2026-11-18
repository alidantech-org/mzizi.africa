import type { Description } from "#/modules/shared/schema/type/description.type.ts";
import type { Integer } from "#/modules/shared/schema/type/integer.type.ts";
import type { Name } from "#/modules/shared/schema/type/name.type.ts";
import type { NonEmptyString100 } from "#/modules/shared/schema/type/non-empty-string100.type.ts";
import type { NonEmptyString255 } from "#/modules/shared/schema/type/non-empty-string255.type.ts";
import type { NonNegativeInteger } from "#/modules/shared/schema/type/non-negative-integer.type.ts";
import type { CalendarDate } from "#/modules/shared/schema/type/calendar-date.type.ts";

/** Calendar Event */
export interface CalendarEvent {
  actualOn?: CalendarDate | null;
  changeNote?: Description | null;
  changeReason?: Name | null;
  daysAway: Integer;
  eventCode: NonEmptyString255;
  kindCode: NonEmptyString100;
  kindLabel: Name;
  knowledgeCode: NonEmptyString100;
  knowledgeLabel: Name;
  name: Name;
  occurrenceCode: NonEmptyString255;
  plannedOn: CalendarDate;
  statusCode: NonEmptyString100;
  statusLabel: Name;
  venueCount: NonNegativeInteger;
}
