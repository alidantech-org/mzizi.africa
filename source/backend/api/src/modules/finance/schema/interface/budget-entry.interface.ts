import type { Id } from "#/modules/shared/schema/type/id.type.ts";
import type { IdentityCode } from "#/modules/shared/schema/type/identity-code.type.ts";
import type { BudgetEntryRevisions } from "#/modules/finance/schema/interface/budget-entry-revisions.interface.ts";
import type { CalendarDate } from "#/modules/shared/schema/type/calendar-date.type.ts";

/** Budget Entry */
export interface BudgetEntry {
  budgetId: Id;
  code: IdentityCode;
  endsOn: CalendarDate;
  kindTerm: Id;
  periodCode: IdentityCode;
  periodId: Id;
  revisions: BudgetEntryRevisions[];
  startsOn: CalendarDate;
}
