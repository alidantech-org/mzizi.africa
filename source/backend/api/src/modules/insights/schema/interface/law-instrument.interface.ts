import type { Code } from "#/modules/insights/schema/type/code.type.ts";
import type { Count } from "#/modules/insights/schema/type/count.type.ts";
import type { NonEmptyString500 } from "#/modules/shared/schema/type/non-empty-string500.type.ts";
import type { CalendarDate } from "#/modules/shared/schema/type/calendar-date.type.ts";

/** Law Instrument */
export interface LawInstrument {
  code: Code;
  enactedOn?: CalendarDate | null;
  kindCode: Code;
  kindLabel: NonEmptyString500;
  name: NonEmptyString500;
  provisions: Count;
}
