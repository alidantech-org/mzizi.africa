import type { Id } from "#/modules/shared/schema/type/id.type.ts";
import type { IdentityCode } from "#/modules/shared/schema/type/identity-code.type.ts";
import type { Name } from "#/modules/shared/schema/type/name.type.ts";
import type { NonEmptyString500 } from "#/modules/shared/schema/type/non-empty-string500.type.ts";
import type { NonNegativeInteger } from "#/modules/shared/schema/type/non-negative-integer.type.ts";
import type { Number } from "#/modules/shared/schema/type/number.type.ts";

/** Place Child */
export interface PlaceChild {
  childCount: NonNegativeInteger;
  featureId: Id;
  kindCode: IdentityCode;
  kindLabel: Name;
  name: Name;
  path?: NonEmptyString500 | null;
  population?: Number | null;
}
