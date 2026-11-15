
import type { Id } from "#/modules/shared/id.type.ts";
import type { CalendarDate } from "#/modules/shared/calendar-date.type.ts";

/** A formally defined administrative, electoral, statistical or historical territorial specialization of one feature; country membership is optional for historic and cross-border units. */
export interface Units {
  countryId?: Id | null;
  featureId: Id;
  validFrom?: CalendarDate | null;
  validUntil?: CalendarDate | null;
}