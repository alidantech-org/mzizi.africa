import type { CurrencyCode } from "#/modules/reference/schema/type/currency-code.type.ts";
import type { AmountMinorUnits } from "#/modules/shared/schema/type/amount-minor-units.type.ts";
import type { Id } from "#/modules/shared/schema/type/id.type.ts";
import type { IdentityCode } from "#/modules/shared/schema/type/identity-code.type.ts";
import type { CalendarDate } from "#/modules/shared/schema/type/calendar-date.type.ts";

/** Project Detail Contracts */
export interface ProjectDetailContracts {
  amount: AmountMinorUnits | null;
  code: IdentityCode;
  contractId: Id;
  contractorId: Id;
  currencyCode: CurrencyCode | null;
  signedOn: CalendarDate | null;
  statusTerm: Id;
}
