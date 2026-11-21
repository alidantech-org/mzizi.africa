import type { Path } from "#/modules/explorer/schema/type/path.type.ts";
import type { IsoAlpha2 } from "#/modules/reference/schema/type/iso-alpha2.type.ts";

/** Navigation Input */
export interface NavigationInput {
  countryCode: IsoAlpha2;
  path?: Path;
}
