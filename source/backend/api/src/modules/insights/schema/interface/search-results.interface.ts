import type { NonEmptyString500 } from "#/modules/shared/schema/type/non-empty-string500.type.ts";
import type { NonNegativeInteger } from "#/modules/shared/schema/type/non-negative-integer.type.ts";
import type { SearchHit } from "#/modules/insights/schema/interface/search-hit.interface.ts";

/** Search Results */
export interface SearchResults {
  counts: Record<string, unknown>;
  hits: SearchHit[];
  query: NonEmptyString500;
  total: NonNegativeInteger;
}
