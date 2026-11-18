import type { NonEmptyString100 } from "#/modules/shared/schema/type/non-empty-string100.type.ts";
import type { NonEmptyString500 } from "#/modules/shared/schema/type/non-empty-string500.type.ts";
import type { PositiveInteger } from "#/modules/shared/schema/type/positive-integer.type.ts";

/** Recurrence Rule */
export interface RecurrenceRule {
  dayOfMonth?: PositiveInteger | null;
  intervalYears?: PositiveInteger | null;
  kindCode: NonEmptyString100;
  month?: PositiveInteger | null;
  nthWeekday?: PositiveInteger | null;
  rrule?: NonEmptyString500 | null;
  weekday?: PositiveInteger | null;
}
