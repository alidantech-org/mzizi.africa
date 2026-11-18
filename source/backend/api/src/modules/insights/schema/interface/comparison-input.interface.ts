import type { Id } from "#/modules/shared/schema/type/id.type.ts";
import type { NonEmptyString1000 } from "#/modules/shared/schema/type/non-empty-string1000.type.ts";

/** Comparison Input */
export interface ComparisonInput {
  a: Id;
  b: Id;
  metrics?: NonEmptyString1000;
}
