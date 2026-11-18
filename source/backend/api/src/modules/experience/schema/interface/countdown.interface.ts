import type { Integer } from "#/modules/shared/schema/type/integer.type.ts";
import type { Name } from "#/modules/shared/schema/type/name.type.ts";
import type { NonEmptyString100 } from "#/modules/shared/schema/type/non-empty-string100.type.ts";
import type { NonEmptyString255 } from "#/modules/shared/schema/type/non-empty-string255.type.ts";
import type { CountdownMilestone } from "#/modules/experience/schema/interface/countdown-milestone.interface.ts";
import type { RecurrenceRule } from "#/modules/experience/schema/interface/recurrence-rule.interface.ts";
import type { CalendarDate } from "#/modules/shared/schema/type/calendar-date.type.ts";

/** Countdown */
export interface Countdown {
  daysAway: Integer;
  eventCode: NonEmptyString255;
  knowledgeCode: NonEmptyString100;
  knowledgeLabel: Name;
  milestones: CountdownMilestone[];
  name: Name;
  plannedOn: CalendarDate;
  rule?: RecurrenceRule | null;
}
