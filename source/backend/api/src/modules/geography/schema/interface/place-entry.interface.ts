import type { IdentityKind } from "#/modules/shared/schema/enum/identity-kind.enum.ts";
import type { Id } from "#/modules/shared/schema/type/id.type.ts";
import type { IdentityCode } from "#/modules/shared/schema/type/identity-code.type.ts";
import type { Year } from "#/modules/shared/schema/type/year.type.ts";
import type { PlaceEntryNames } from "#/modules/geography/schema/interface/place-entry-names.interface.ts";

/** Place Entry */
export interface PlaceEntry {
  code: IdentityCode;
  featureId: Id;
  fromYear: Year | null;
  identityKind: IdentityKind;
  kindTerm: Id;
  names: PlaceEntryNames[];
  toYear: Year | null;
}
