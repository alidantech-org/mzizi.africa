import type { IsoAlpha2 } from "#/modules/reference/schema/type/iso-alpha2.type.ts";
import type { Flag } from "#/modules/shared/schema/type/flag.type.ts";
import type { Id } from "#/modules/shared/schema/type/id.type.ts";
import type { Name } from "#/modules/shared/schema/type/name.type.ts";
import type { Url } from "#/modules/shared/schema/type/url.type.ts";

/** Country Choice */
export interface CountryChoice {
  code: IsoAlpha2;
  flagUrl?: Url | null;
  id: Id;
  name: Name;
  rootFeatureId?: Id | null;
  served: Flag;
}
