import type { Name } from "#/modules/shared/schema/type/name.type.ts";
import type { NonEmptyString100 } from "#/modules/shared/schema/type/non-empty-string100.type.ts";
import type { NonNegativeInteger } from "#/modules/shared/schema/type/non-negative-integer.type.ts";

/** Class Count */
export interface ClassCount {
  code: NonEmptyString100;
  count: NonNegativeInteger;
  label: Name;
  parentCode?: NonEmptyString100 | null;
}
