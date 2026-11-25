import type { Id } from "#/modules/shared/schema/type/id.type.ts";
import type { PositiveInteger } from "#/modules/shared/schema/type/positive-integer.type.ts";
import type { CalendarDate } from "#/modules/shared/schema/type/calendar-date.type.ts";

/** Budget Entry Revisions */
export interface BudgetEntryRevisions {
  releasedOn: CalendarDate | null;
  revision: PositiveInteger;
  revisionId: Id;
  statusTerm: Id;
}
