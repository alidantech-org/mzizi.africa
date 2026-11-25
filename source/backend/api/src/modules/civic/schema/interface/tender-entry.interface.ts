import type { CurrencyCode } from "#/modules/reference/schema/type/currency-code.type.ts";
import type { AmountMinorUnits } from "#/modules/shared/schema/type/amount-minor-units.type.ts";
import type { Id } from "#/modules/shared/schema/type/id.type.ts";
import type { IdentityCode } from "#/modules/shared/schema/type/identity-code.type.ts";
import type { TenderEntryNames } from "#/modules/civic/schema/interface/tender-entry-names.interface.ts";
import type { CalendarDate } from "#/modules/shared/schema/type/calendar-date.type.ts";

/** Tender Entry */
export interface TenderEntry {
  amount: AmountMinorUnits | null;
  buyerId: Id;
  categoryTerm: Id;
  closesOn: CalendarDate | null;
  code: IdentityCode;
  currencyCode: CurrencyCode | null;
  names: TenderEntryNames[];
  procedureTerm: Id;
  procurementId: Id;
  publishedOn: CalendarDate | null;
  statusTerm: Id;
}
