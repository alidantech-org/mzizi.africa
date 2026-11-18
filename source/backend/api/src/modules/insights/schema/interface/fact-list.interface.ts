import type { NonEmptyString500 } from "#/modules/shared/schema/type/non-empty-string500.type.ts";

/** Fact List */
export interface FactList {
  facts: Record<string, unknown>[];
  gaps: NonEmptyString500[];
}
