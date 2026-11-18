import type { NonEmptyString500 } from "#/modules/shared/schema/type/non-empty-string500.type.ts";

/** Comparison */
export interface Comparison {
  a: Record<string, unknown>;
  b: Record<string, unknown>;
  gaps: NonEmptyString500[];
  rows: Record<string, unknown>[];
}
