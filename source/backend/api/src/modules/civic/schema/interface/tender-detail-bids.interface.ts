import type { AmountMinorUnits } from "#/modules/shared/schema/type/amount-minor-units.type.ts";
import type { Id } from "#/modules/shared/schema/type/id.type.ts";
import type { CalendarDate } from "#/modules/shared/schema/type/calendar-date.type.ts";

/** Tender Detail Bids */
export interface TenderDetailBids {
  amount: AmountMinorUnits | null;
  bidderId: Id;
  outcomeTerm: Id;
  submittedOn: CalendarDate | null;
}
