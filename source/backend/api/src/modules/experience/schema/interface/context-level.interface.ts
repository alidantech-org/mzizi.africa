import type { Flag } from "#/modules/shared/schema/type/flag.type.ts";
import type { Name } from "#/modules/shared/schema/type/name.type.ts";
import type { NonEmptyString100 } from "#/modules/shared/schema/type/non-empty-string100.type.ts";
import type { NonNegativeInteger } from "#/modules/shared/schema/type/non-negative-integer.type.ts";

/** Context Level */
export interface ContextLevel {
  depth: NonNegativeInteger;
  isRouting: Flag;
  kindCode: NonEmptyString100;
  kindLabel: Name;
}
