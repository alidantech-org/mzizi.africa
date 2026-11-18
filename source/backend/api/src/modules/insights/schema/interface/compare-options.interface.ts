import type { NonEmptyString500 } from "#/modules/shared/schema/type/non-empty-string500.type.ts";

/** Compare Options */
export interface CompareOptions {
  gaps: NonEmptyString500[];
  hierarchy: Record<string, unknown>[];
  metrics: Record<string, unknown>[];
  nearby: Record<string, unknown>[];
  place: Record<string, unknown>;
  top: Record<string, unknown>[];
}
