import type { CurrencyCode } from "#/modules/reference/schema/type/currency-code.type.ts";
import type { AmountMinorUnits } from "#/modules/shared/schema/type/amount-minor-units.type.ts";
import type { Id } from "#/modules/shared/schema/type/id.type.ts";
import type { IdentityCode } from "#/modules/shared/schema/type/identity-code.type.ts";

/** Finding Entry */
export interface FindingEntry {
  amount: AmountMinorUnits | null;
  code: IdentityCode;
  contractId: Id | null;
  currencyCode: CurrencyCode | null;
  findingId: Id;
  kindTerm: Id;
  periodId: Id;
  projectId: Id | null;
  statusTerm: Id;
}
