import type { Name } from "#/modules/shared/schema/type/name.type.ts";
import type { NonEmptyString255 } from "#/modules/shared/schema/type/non-empty-string255.type.ts";
import type { NonNegativeInteger } from "#/modules/shared/schema/type/non-negative-integer.type.ts";

/** Level */
export interface Level {
  depth: NonNegativeInteger;
  kindCode: NonEmptyString255;
  label: Name;
}
