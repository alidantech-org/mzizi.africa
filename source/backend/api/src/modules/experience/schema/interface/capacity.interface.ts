import type { Name } from "#/modules/shared/schema/type/name.type.ts";
import type { NonEmptyString255 } from "#/modules/shared/schema/type/non-empty-string255.type.ts";
import type { Number } from "#/modules/shared/schema/type/number.type.ts";

/** Capacity */
export interface Capacity {
  indicatorCode: NonEmptyString255;
  label: Name;
  value: Number;
}
