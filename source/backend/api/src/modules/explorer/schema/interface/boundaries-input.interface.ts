import type { BoundaryMode } from "#/modules/explorer/schema/enum/boundary-mode.enum.ts";
import type { LanguageCode } from "#/modules/explorer/schema/type/language-code.type.ts";
import type { Limit } from "#/modules/explorer/schema/type/limit.type.ts";
import type { Path } from "#/modules/explorer/schema/type/path.type.ts";
import type { SimplifyDegrees } from "#/modules/explorer/schema/type/simplify-degrees.type.ts";
import type { IsoAlpha2 } from "#/modules/reference/schema/type/iso-alpha2.type.ts";

/** Boundaries Input */
export interface BoundariesInput {
  countryCode: IsoAlpha2;
  languageCode?: LanguageCode;
  limit?: Limit;
  mode?: BoundaryMode;
  path?: Path;
  simplify?: SimplifyDegrees;
}
