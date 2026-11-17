import type { Integer } from "#/modules/shared/schema/type/integer.type.ts";
import type { NonEmptyString100 } from "#/modules/shared/schema/type/non-empty-string100.type.ts";

/** Source Search Input */
export interface SourceSearchInput {
  limit?: Integer;
  query?: NonEmptyString100;
}
