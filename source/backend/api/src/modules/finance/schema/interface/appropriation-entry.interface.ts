import type { CurrencyCode } from "#/modules/reference/schema/type/currency-code.type.ts";
import type { AmountMinorUnits } from "#/modules/shared/schema/type/amount-minor-units.type.ts";
import type { Id } from "#/modules/shared/schema/type/id.type.ts";
import type { IdentityCode } from "#/modules/shared/schema/type/identity-code.type.ts";

/** Appropriation Entry */
export interface AppropriationEntry {
  amount: AmountMinorUnits | null;
  appropriationId: Id;
  classTerm: Id;
  code: IdentityCode;
  currencyCode: CurrencyCode | null;
  featureId: Id | null;
  parentId: Id | null;
  projectId: Id | null;
  recipientId: Id | null;
}
