import type { LanguageCode } from "#/modules/explorer/schema/type/language-code.type.ts";
import type { Path } from "#/modules/explorer/schema/type/path.type.ts";
import type { IsoAlpha2 } from "#/modules/reference/schema/type/iso-alpha2.type.ts";
import type { Id } from "#/modules/shared/schema/type/id.type.ts";
import type { Name } from "#/modules/shared/schema/type/name.type.ts";
import type { NonEmptyString255 } from "#/modules/shared/schema/type/non-empty-string255.type.ts";
import type { NonNegativeInteger } from "#/modules/shared/schema/type/non-negative-integer.type.ts";

/** Place */
export interface Place {
  canonicalPath: Path;
  citationCount: NonNegativeInteger;
  code: NonEmptyString255;
  countryCode: IsoAlpha2;
  depth: NonNegativeInteger;
  featureId: Id;
  kind: Name;
  name: Name;
  nameLanguage?: LanguageCode | null;
  parentFeatureId?: Id | null;
}
