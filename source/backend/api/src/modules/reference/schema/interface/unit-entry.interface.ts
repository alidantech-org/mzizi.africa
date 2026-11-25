import type { Id } from "#/modules/shared/schema/type/id.type.ts";
import type { IdentityCode } from "#/modules/shared/schema/type/identity-code.type.ts";
import type { NonEmptyString100 } from "#/modules/shared/schema/type/non-empty-string100.type.ts";
import type { UnitEntryNames } from "#/modules/reference/schema/interface/unit-entry-names.interface.ts";

/** Unit Entry */
export interface UnitEntry {
  baseId: Id | null;
  code: IdentityCode;
  names: UnitEntryNames[];
  quantityTerm: Id;
  symbol: NonEmptyString100;
  unitId: Id;
}
