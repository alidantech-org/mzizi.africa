import type { Id } from "#/modules/shared/schema/type/id.type.ts";
import type { NonEmptyString255 } from "#/modules/shared/schema/type/non-empty-string255.type.ts";
import type { CalendarDate } from "#/modules/shared/schema/type/calendar-date.type.ts";

/** Instrument Detail Editions */
export interface InstrumentDetailEditions {
  commencedOn: CalendarDate | null;
  consolidatedOn: CalendarDate | null;
  designation: NonEmptyString255;
  editionId: Id;
}
