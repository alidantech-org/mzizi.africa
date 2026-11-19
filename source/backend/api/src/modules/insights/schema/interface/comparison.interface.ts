import type { NonEmptyString500 } from "#/modules/shared/schema/type/non-empty-string500.type.ts";
import type { ComparisonA } from "#/modules/insights/schema/interface/comparison-a.interface.ts";
import type { ComparisonB } from "#/modules/insights/schema/interface/comparison-b.interface.ts";
import type { ComparisonRows } from "#/modules/insights/schema/interface/comparison-rows.interface.ts";

/** Comparison */
export interface Comparison {
  a: ComparisonA;
  b: ComparisonB;
  gaps: NonEmptyString500[];
  rows: ComparisonRows[];
}
