import type { Id } from "#/modules/shared/schema/type/id.type.ts";
import type { PositiveInteger } from "#/modules/shared/schema/type/positive-integer.type.ts";
import type { CalendarDate } from "#/modules/shared/schema/type/calendar-date.type.ts";

/** Bill Detail Stages */
export interface BillDetailStages {
  kindTerm: Id;
  motionId: Id | null;
  occurrenceId: Id | null;
  onDate: CalendarDate | null;
  outcomeTerm: Id | null;
  sequence: PositiveInteger;
  sittingId: Id | null;
}
