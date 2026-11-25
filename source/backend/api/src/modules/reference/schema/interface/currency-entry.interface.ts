import type { CurrencyCode } from "#/modules/reference/schema/type/currency-code.type.ts";
import type { MinorUnits } from "#/modules/reference/schema/type/minor-units.type.ts";
import type { Id } from "#/modules/shared/schema/type/id.type.ts";
import type { IdentityCode } from "#/modules/shared/schema/type/identity-code.type.ts";
import type { NonEmptyString100 } from "#/modules/shared/schema/type/non-empty-string100.type.ts";
import type { CurrencyEntryNames } from "#/modules/reference/schema/interface/currency-entry-names.interface.ts";

/** Currency Entry */
export interface CurrencyEntry {
  code: IdentityCode;
  currencyId: Id;
  isoCode: CurrencyCode | null;
  minorUnits: MinorUnits;
  names: CurrencyEntryNames[];
  symbol: NonEmptyString100 | null;
}
