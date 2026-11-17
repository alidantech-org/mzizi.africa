import type { Id } from "#/modules/shared/schema/type/id.type.ts";
import type { IdentityCode } from "#/modules/shared/schema/type/identity-code.type.ts";
import type { Name } from "#/modules/shared/schema/type/name.type.ts";
import type { NonNegativeInteger } from "#/modules/shared/schema/type/non-negative-integer.type.ts";

/** Locality Unit */
export interface LocalityUnit {
  code: IdentityCode;
  depth: NonNegativeInteger;
  featureId: Id;
  kindCode: IdentityCode;
  kindLabel: Name;
  name: Name;
}
