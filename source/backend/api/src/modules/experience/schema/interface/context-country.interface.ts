import type { Flag } from "#/modules/shared/schema/type/flag.type.ts";
import type { Name } from "#/modules/shared/schema/type/name.type.ts";
import type { NonEmptyString100 } from "#/modules/shared/schema/type/non-empty-string100.type.ts";

/** Context Country */
export interface ContextCountry {
  code: NonEmptyString100;
  currencyCode?: NonEmptyString100 | null;
  defaultLanguageCode?: NonEmptyString100 | null;
  isServed: Flag;
  isoCode?: NonEmptyString100 | null;
  name: Name;
  subdomain?: NonEmptyString100 | null;
}
