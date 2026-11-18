import type { NonEmptyString500 } from "#/modules/shared/schema/type/non-empty-string500.type.ts";

/** Election Detail */
export interface ElectionDetail {
  contests: Record<string, unknown>[];
  election: Record<string, unknown>;
  gaps: NonEmptyString500[];
  totals: Record<string, unknown>[];
  units: Record<string, unknown>[];
}
