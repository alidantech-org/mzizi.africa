import type { Flag } from "#/modules/shared/schema/type/flag.type.ts";
import type { Name } from "#/modules/shared/schema/type/name.type.ts";
import type { NonEmptyString100 } from "#/modules/shared/schema/type/non-empty-string100.type.ts";

/** Country Choice */
export interface CountryChoice {
  code: NonEmptyString100;
  isServed: Flag;
  name: Name;
}
