import type { LanguageCode } from "#/modules/explorer/schema/type/language-code.type.ts";
import type { Limit } from "#/modules/explorer/schema/type/limit.type.ts";
import type { Query } from "#/modules/explorer/schema/type/query.type.ts";
import type { IsoAlpha2 } from "#/modules/reference/schema/type/iso-alpha2.type.ts";
import type { Id } from "#/modules/shared/schema/type/id.type.ts";
import type { NonNegativeInteger } from "#/modules/shared/schema/type/non-negative-integer.type.ts";
import type { PositiveInteger } from "#/modules/shared/schema/type/positive-integer.type.ts";

/** Search Input */
export interface SearchInput {
  countryCode: IsoAlpha2;
  depth?: NonNegativeInteger;
  languageCode?: LanguageCode;
  limit?: Limit;
  page?: PositiveInteger;
  parentFeatureId?: Id;
  query: Query;
}
