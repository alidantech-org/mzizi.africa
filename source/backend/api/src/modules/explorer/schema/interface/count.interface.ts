import type { Name } from "#/modules/shared/schema/type/name.type.ts";
import type { NonNegativeInteger } from "#/modules/shared/schema/type/non-negative-integer.type.ts";

/** Count */
export interface Count {
  label: Name;
  value: NonNegativeInteger;
}
